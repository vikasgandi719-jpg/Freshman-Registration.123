import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, STORAGE_KEYS } from '../constants/config';

const withTimeout = (promise, ms = API.TIMEOUT) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms)
  );
  return Promise.race([promise, timeout]);
};

const buildHeaders = async (tokenKey, isFormData = false) => {
  const token = await AsyncStorage.getItem(tokenKey);
  const headers = { Accept: 'application/json' };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token)       headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('Content-Type') || '';
  const isJson      = contentType.includes('application/json');
  const data        = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (data?.message || data?.error)) ||
      `Request failed with status ${response.status}`;
    const error   = new Error(message);
    error.status  = response.status;
    error.data    = data;
    throw error;
  }

  return data;
};

const fetchWithRetry = async (url, options, retries = API.RETRY_COUNT) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await withTimeout(fetch(url, options));
    } catch (error) {
      const isLast    = attempt === retries;
      const isNetwork = error.message === 'Network request failed' || error.message.includes('timed out');
      if (isLast || !isNetwork) throw error;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
};

// Creates an HTTP client bound to a specific stored bearer token.
// Student requests and admin requests must never share a token — otherwise
// logging into one role while the other session is active overwrites it.
const createApiClient = (tokenKey) => {
  const request = async (method, endpoint, body = null, isFormData = false) => {
    const url     = `${API.BASE_URL}${endpoint}`;
    const headers = await buildHeaders(tokenKey, isFormData);

    const options = { method, headers };
    if (body) options.body = isFormData ? body : JSON.stringify(body);

    const response = await fetchWithRetry(url, options);
    return handleResponse(response);
  };

  return {
    get:    (endpoint)           => request('GET',    endpoint),
    post:   (endpoint, body)     => request('POST',   endpoint, body),
    put:    (endpoint, body)     => request('PUT',    endpoint, body),
    patch:  (endpoint, body)     => request('PATCH',  endpoint, body),
    delete: (endpoint)           => request('DELETE', endpoint),
    upload: (endpoint, formData) => request('POST',   endpoint, formData, true),
  };
};

// Student / general auth client — uses STORAGE_KEYS.AUTH_TOKEN.
const api = createApiClient(STORAGE_KEYS.AUTH_TOKEN);

// Admin client — uses STORAGE_KEYS.ADMIN_TOKEN, kept separate so an admin
// session and a student session can coexist without clobbering each other.
export const adminApi = createApiClient(STORAGE_KEYS.ADMIN_TOKEN);

export default api;

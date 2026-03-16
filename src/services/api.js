import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, STORAGE_KEYS } from '../constants/config';

// ─── Request timeout helper ────────────────────────────────────────────────────
const withTimeout = (promise, ms = API.TIMEOUT) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms)
  );
  return Promise.race([promise, timeout]);
};

// ─── Build headers ─────────────────────────────────────────────────────────────
const buildHeaders = async (isFormData = false) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const headers = {
    Accept: 'application/json',
  };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token)       headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ─── Handle response ───────────────────────────────────────────────────────────
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

// ─── Retry logic ───────────────────────────────────────────────────────────────
const fetchWithRetry = async (url, options, retries = API.RETRY_COUNT) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await withTimeout(fetch(url, options));
      return response;
    } catch (error) {
      const isLast     = attempt === retries;
      const isNetwork  = error.message === 'Network request failed' || error.message.includes('timed out');
      if (isLast || !isNetwork) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
};

// ─── Core request function ─────────────────────────────────────────────────────
const request = async (method, endpoint, body = null, isFormData = false) => {
  const url     = `${API.BASE_URL}${endpoint}`;
  const headers = await buildHeaders(isFormData);

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetchWithRetry(url, options);
  return handleResponse(response);
};

// ─── HTTP methods ──────────────────────────────────────────────────────────────
const api = {
  get:    (endpoint)              => request('GET',    endpoint),
  post:   (endpoint, body)        => request('POST',   endpoint, body),
  put:    (endpoint, body)        => request('PUT',    endpoint, body),
  patch:  (endpoint, body)        => request('PATCH',  endpoint, body),
  delete: (endpoint)              => request('DELETE', endpoint),
  upload: (endpoint, formData)    => request('POST',   endpoint, formData, true),
};

export default api;
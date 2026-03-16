// ─── Deep clone ────────────────────────────────────────────────────────────────
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

// ─── Sleep / delay ─────────────────────────────────────────────────────────────
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Debounce ──────────────────────────────────────────────────────────────────
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ─── Throttle ──────────────────────────────────────────────────────────────────
export const throttle = (fn, limit = 500) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
};

// ─── Group array by key ────────────────────────────────────────────────────────
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key] ?? 'Other';
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

// ─── Sort array ────────────────────────────────────────────────────────────────
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';
    const cmp  = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return direction === 'asc' ? cmp : -cmp;
  });
};

// ─── Filter array by search term ──────────────────────────────────────────────
export const filterBySearch = (array, query, keys = []) => {
  if (!query || !query.trim()) return array;
  const lower = query.trim().toLowerCase();
  return array.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return value && String(value).toLowerCase().includes(lower);
    })
  );
};

// ─── Unique array ─────────────────────────────────────────────────────────────
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

// ─── Chunk array ──────────────────────────────────────────────────────────────
export const chunk = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

// ─── Check if empty ───────────────────────────────────────────────────────────
export const isEmpty = (value) => {
  if (value === null || value === undefined)  return true;
  if (typeof value === 'string')              return value.trim().length === 0;
  if (Array.isArray(value))                   return value.length === 0;
  if (typeof value === 'object')              return Object.keys(value).length === 0;
  return false;
};

// ─── Pick / Omit keys ─────────────────────────────────────────────────────────
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};

// ─── Merge objects ────────────────────────────────────────────────────────────
export const mergeDeep = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
};

const isObject = (item) =>
  item && typeof item === 'object' && !Array.isArray(item);

// ─── Generate unique ID ────────────────────────────────────────────────────────
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// ─── Capitalize ───────────────────────────────────────────────────────────────
export const capitalize = (str = '') => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ─── Parse API error ──────────────────────────────────────────────────────────
export const parseApiError = (error) => {
  if (!error)                  return 'Something went wrong. Please try again.';
  if (typeof error === 'string') return error;
  if (error.message)           return error.message;
  if (error.data?.message)     return error.data.message;
  if (error.data?.error)       return error.data.error;
  if (error.status === 400)    return 'Invalid request. Please check your inputs.';
  if (error.status === 401)    return 'Session expired. Please login again.';
  if (error.status === 403)    return 'You do not have permission to perform this action.';
  if (error.status === 404)    return 'The requested resource was not found.';
  if (error.status === 409)    return 'A conflict occurred. Please try again.';
  if (error.status === 422)    return 'Invalid data. Please check your inputs.';
  if (error.status === 429)    return 'Too many requests. Please slow down.';
  if (error.status >= 500)     return 'Server error. Please try again later.';
  return 'Something went wrong. Please try again.';
};

// ─── Build FormData from object ───────────────────────────────────────────────
export const buildFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && value.uri) {
        // React Native file object
        formData.append(key, {
          uri:  value.uri,
          name: value.name || `${key}.${value.type?.split('/')[1] || 'jpg'}`,
          type: value.type || 'application/octet-stream',
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

// ─── Document helpers ─────────────────────────────────────────────────────────
export const calcCompletionPercent = (documents = []) => {
  if (!documents.length) return 0;
  const approved = documents.filter((d) => d.status === 'approved').length;
  return Math.round((approved / documents.length) * 100);
};

export const getDocumentStats = (documents = []) => {
  return documents.reduce(
    (acc, doc) => {
      acc.total++;
      const status = doc.status || 'not_uploaded';
      if (acc[status] !== undefined) acc[status]++;
      else acc.not_uploaded++;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0, not_uploaded: 0 }
  );
};

// ─── Color helpers ────────────────────────────────────────────────────────────
export const hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

// ─── Platform helpers ─────────────────────────────────────────────────────────
export const isAndroid = () => {
  const { Platform } = require('react-native');
  return Platform.OS === 'android';
};

export const isIOS = () => {
  const { Platform } = require('react-native');
  return Platform.OS === 'ios';
};
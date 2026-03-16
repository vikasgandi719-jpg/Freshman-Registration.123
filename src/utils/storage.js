import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Set item ─────────────────────────────────────────────────────────────────
export const setItem = async (key, value) => {
  try {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[Storage] setItem failed — key: "${key}"`, error);
    return false;
  }
};

// ─── Get item ─────────────────────────────────────────────────────────────────
export const getItem = async (key, fallback = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return value; // plain string
    }
  } catch (error) {
    console.warn(`[Storage] getItem failed — key: "${key}"`, error);
    return fallback;
  }
};

// ─── Remove item ──────────────────────────────────────────────────────────────
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[Storage] removeItem failed — key: "${key}"`, error);
    return false;
  }
};

// ─── Multi set ────────────────────────────────────────────────────────────────
export const setMultiple = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.warn('[Storage] setMultiple failed', error);
    return false;
  }
};

// ─── Multi get ────────────────────────────────────────────────────────────────
export const getMultiple = async (keys) => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce((acc, [key, value]) => {
      try {
        acc[key] = value !== null ? JSON.parse(value) : null;
      } catch {
        acc[key] = value;
      }
      return acc;
    }, {});
  } catch (error) {
    console.warn('[Storage] getMultiple failed', error);
    return {};
  }
};

// ─── Multi remove ─────────────────────────────────────────────────────────────
export const removeMultiple = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.warn('[Storage] removeMultiple failed', error);
    return false;
  }
};

// ─── Clear all ────────────────────────────────────────────────────────────────
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.warn('[Storage] clearAll failed', error);
    return false;
  }
};

// ─── Get all keys ─────────────────────────────────────────────────────────────
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.warn('[Storage] getAllKeys failed', error);
    return [];
  }
};

// ─── Check if key exists ──────────────────────────────────────────────────────
export const hasItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.warn(`[Storage] hasItem failed — key: "${key}"`, error);
    return false;
  }
};

// ─── Append to array stored at key ───────────────────────────────────────────
export const appendToArray = async (key, item) => {
  try {
    const existing = await getItem(key, []);
    const updated  = Array.isArray(existing) ? [...existing, item] : [item];
    await setItem(key, updated);
    return updated;
  } catch (error) {
    console.warn(`[Storage] appendToArray failed — key: "${key}"`, error);
    return [];
  }
};

// ─── Update object stored at key ─────────────────────────────────────────────
export const updateObject = async (key, updates) => {
  try {
    const existing = await getItem(key, {});
    const updated  = { ...(existing || {}), ...updates };
    await setItem(key, updated);
    return updated;
  } catch (error) {
    console.warn(`[Storage] updateObject failed — key: "${key}"`, error);
    return updates;
  }
};

// ─── Default export ───────────────────────────────────────────────────────────
const storage = {
  setItem,
  getItem,
  removeItem,
  setMultiple,
  getMultiple,
  removeMultiple,
  clearAll,
  getAllKeys,
  hasItem,
  appendToArray,
  updateObject,
};

export default storage;
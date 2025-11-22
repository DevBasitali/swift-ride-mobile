import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  async set(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  async multiGet(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.map(([key, value]) => [key, JSON.parse(value)]);
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return [];
    }
  }

  async multiSet(keyValuePairs) {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error('Storage multiSet error:', error);
      return false;
    }
  }
}

export default new Storage();
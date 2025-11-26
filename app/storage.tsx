import AsyncStorage from "@react-native-async-storage/async-storage";
export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('saveData error', e);
  }
};

export const getData = async (key: string) => {
  try {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('getData error', e);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('removeData error', e);
  }
};
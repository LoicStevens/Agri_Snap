import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Prediction {
  id: number;
  imageUri: string;
  crops: string[];
  date: string;
}

export const savePrediction = async (newPrediction: Prediction) => {
  try {
    const existing = await AsyncStorage.getItem('predictions');
    console.log('existing predictions:', existing);
    const predictions = existing ? JSON.parse(existing) : [];

    const updatedPredictions = [newPrediction, ...predictions];
    console.log('updated predictions:', updatedPredictions);

    await AsyncStorage.setItem('predictions', JSON.stringify(updatedPredictions));
    console.log('Saved successfully!');
  } catch (error) {
    console.error('Error saving prediction:', error);
  }
};


export const getPredictions = async () => {
  try {
    const stored = await AsyncStorage.getItem('predictions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return [];
  }
};

export const clearPredictions = async () => {
  try {
    await AsyncStorage.removeItem('predictions');
  } catch (error) {
    console.error('Error clearing predictions:', error);
  }
};

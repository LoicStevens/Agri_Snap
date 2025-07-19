import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

type Prediction = {
  id: number;
  imageUri: string;
  date: string;
  crops: string[];
};

const getAllPredictions = async (): Promise<Prediction[]> => {
  try {
    const stored = await AsyncStorage.getItem('predictions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur chargement historique:', error);
    return [];
  }
};

const HistoriqueScreen = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    getAllPredictions()
      .then(setPredictions)
      .catch(err => console.log('❌ Erreur chargement historique:', err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        <FontAwesome5 name="history" size={20} color="#333" /> Historique des Prédictions
      </Text>

      {predictions.length === 0 ? (
        <Text style={styles.empty}>Aucune prédiction enregistrée.</Text>
      ) : (
        predictions.map(pred => (
          <View key={pred.id} style={styles.card}>
            <Image source={{ uri: pred.imageUri }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.row}>
                <MaterialCommunityIcons name="calendar" size={16} color="#333" />
                <Text style={styles.text}> {new Date(pred.date).toLocaleDateString()}</Text>
              </Text>
              <Text style={styles.row}>
                <MaterialCommunityIcons name="sprout" size={16} color="#333" />
                <Text style={styles.text}> Cultures : {pred.crops.join(', ')}</Text>
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default HistoriqueScreen;

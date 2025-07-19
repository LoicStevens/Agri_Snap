import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RembourserScreen() {
  const [personnes, setPersonnes] = useState<{ id: string; nom: string; montant: number }[]>([]);

  useEffect(() => {
    const fetchPersonnes = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const querySnapshot = await getDocs(collection(db, `utilisateurs/${user.uid}/personnes`));
      const personnesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; nom: string; montant: number }[];
      
      setPersonnes(personnesData);
    };

    fetchPersonnes();
  }, []);

  const rembourserMontant = async (id: string, index: number, montantRembourse: string) => {
    const valeurRemboursee = parseFloat(montantRembourse);
    if (isNaN(valeurRemboursee)) return;

    const nouvelleListe = [...personnes];
    nouvelleListe[index].montant -= valeurRemboursee;
    if (nouvelleListe[index].montant < 0) nouvelleListe[index].montant = 0; // Évite les montants négatifs
    setPersonnes(nouvelleListe);

    // Mise à jour dans Firestore
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, `utilisateurs/${user.uid}/personnes`, id);
    await updateDoc(docRef, { montant: nouvelleListe[index].montant });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Rembourser une personne</Text>
      <FlatList
        data={personnes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>{item.nom} - {item.montant} FCFA</Text>
            <TextInput
              placeholder="Montant à rembourser"
              keyboardType="numeric"
              style={{ borderWidth: 1, width: 100, padding: 5, marginRight: 5 }}
              onSubmitEditing={(event) => rembourserMontant(item.id, index, event.nativeEvent.text)}
            />
          </View>
        )}
      />
    </View>
  );
}

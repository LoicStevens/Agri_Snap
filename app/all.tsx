import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RecapitulatifScreen() {
  const [personnes, setPersonnes] = useState<{ id: string; nom: string; montant: number }[]>([]);
  const [historique, setHistorique] = useState<{ type: string; montant: number; date: string }[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

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

  const fetchHistorique = async (personId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const querySnapshot = await getDocs(collection(db, `utilisateurs/${user.uid}/personnes/${personId}/historique`));
    const historiqueData = querySnapshot.docs.map((doc) => doc.data()) as { type: string; montant: number; date: string }[];
    setHistorique(historiqueData);
    setSelectedPerson(personId);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Récapitulatif</Text>
      <FlatList
        data={personnes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchHistorique(item.id)}>
            <Text style={{ padding: 10, borderBottomWidth: 1 }}>{item.nom} - {item.montant} FCFA</Text>
          </TouchableOpacity>
        )}
      />

      {selectedPerson && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Historique des opérations</Text>
          <FlatList
            data={historique}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ padding: 5 }}>{item.date} - {item.type}: {item.montant} FCFA</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

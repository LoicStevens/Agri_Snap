import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; 

export default function AjouterScreen() {
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [recherche, setRecherche] = useState("");
  const [personnes, setPersonnes] = useState<{ id: string; nom: string; montant: number }[]>([]);

  // Charger les personnes au démarrage
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

  // Ajouter une nouvelle personne
  const ajouterPersonne = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Utilisateur non connecté !");
      return;
    }

    if (!nom.trim() || !montant.trim()) {
      console.error("Nom ou montant vide !");
      return;
    }

    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      console.error("Montant invalide !");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, `utilisateurs/${user.uid}/personnes`), {
        nom: nom.trim(),
        montant: montantNum,
      });

      setPersonnes([...personnes, { id: docRef.id, nom: nom.trim(), montant: montantNum }]);
      setNom("");
      setMontant("");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // Mettre à jour le montant
  const mettreAJourMontant = async (id: string, index: number, montantAjoute: string) => {
    const valeurAjoutee = parseFloat(montantAjoute);
    if (isNaN(valeurAjoutee) || valeurAjoutee <= 0) return;

    const user = auth.currentUser;
    if (!user) return;

    const nouvelleListe = [...personnes];
    nouvelleListe[index].montant += valeurAjoutee;
    setPersonnes(nouvelleListe);

    // Mise à jour de Firestore
    const docRef = doc(db, `utilisateurs/${user.uid}/personnes`, id);
    await updateDoc(docRef, { montant: nouvelleListe[index].montant });
  };

  // Filtrer la liste des personnes
  const personnesFiltrees = personnes.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Ajouter une personne</Text>
      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Montant"
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Ajouter" onPress={ajouterPersonne} />

      <Text style={{ marginTop: 20 }}>Rechercher une personne</Text>
      <TextInput
        placeholder="Recherche..."
        value={recherche}
        onChangeText={setRecherche}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <FlatList
        data={personnesFiltrees}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>{item.nom} - {item.montant} FCFA</Text>
            <TextInput
              placeholder="Ajouter montant"
              keyboardType="numeric"
              style={{ borderWidth: 1, width: 80, padding: 5, marginRight: 5 }}
              onSubmitEditing={(event) => mettreAJourMontant(item.id, index, event.nativeEvent.text)}
            />
          </View>
        )}
      />
    </View>
  );
}

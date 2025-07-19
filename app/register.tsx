import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const GREEN_800 = "#166534";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    // Validation locale
    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.replace("/home");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Cet e-mail est déjà utilisé.");
      } else if (err.code === "auth/invalid-email") {
        setError("L'adresse e-mail est invalide.");
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/logo/logo-agrisnap.png")}
          style={{ width: 122, height: 122 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push("/login")}>
          <Text style={styles.tabText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Adresse électronique</Text>
        <TextInput
          placeholder="Entrer l'adresse électronique"
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          placeholder="Entrer le mot de passe"
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <TextInput
          placeholder="Confirmer le mot de passe"
          style={styles.input}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError("");
          }}
          secureTextEntry
        />

        {/* Affichage des erreurs */}
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 15,
    color: '#888',
  },
  activeTabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: GREEN_800,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: GREEN_800,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: '#666',
    fontSize: 13,
  },
  loginLink: {
    color: GREEN_800,
    fontWeight: 'bold',
    fontSize: 13,
  },

  // 🔥 Ligne ajoutée pour les erreurs
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
});

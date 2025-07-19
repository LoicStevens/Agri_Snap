import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const GREEN_800 = "#166534";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleResetPassword = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Veuillez entrer votre e-mail.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Un e-mail de réinitialisation a été envoyé !");
      setEmail("");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // redirection après 2s
    } catch (error: unknown) {
      console.error("Erreur Firebase :", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite.");
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
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Réinitialisation du mot de passe</Text>

      <Text style={styles.label}>Adresse électronique</Text>
      <TextInput
        placeholder="Entrez votre e-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(""); // efface l'erreur en tapant
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, error && { borderColor: "red" }]}
      />

      {/* Message d'erreur */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Message de succès */}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.resetButton, loading && { opacity: 0.6 }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: GREEN_800,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
  successText: {
    color: "green",
    fontSize: 13,
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: GREEN_800,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

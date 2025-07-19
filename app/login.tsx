import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";


const GREEN_800 = "#166534";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  // Google Auth hook
  const redirectUri = AuthSession.makeRedirectUri(); // Pas d'options ici

const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId: "464632148031-9h1644hkkakge6qhs4f76qhje8rq6mda.apps.googleusercontent.com",
  redirectUri,
});



// Tu peux aussi logger le redirectUri généré
console.log("Redirect URI:", request?.redirectUri);

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => router.replace("/home"))
        .catch((err) => setError("Erreur Google : " + err.message));
    }
  }, [response]);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Veuillez entrer votre e-mail et mot de passe.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      router.replace("/home");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Utilisateur non trouvé.");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect.");
      } else if (err.code === "auth/invalid-email") {
        setError("E-mail invalide.");
      } else {
        setError("Erreur lors de la connexion.");
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
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push("/register")}>
          <Text style={styles.tabText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Adresse électronique</Text>
        <TextInput
          placeholder="Entrer l'adresse électronique"
          style={[styles.input, emailFocused && styles.inputFocused]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
          }}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordHeader}>
          <Text style={styles.label}>Mot de passe</Text>
          <TouchableOpacity onPress={() => router.push("/resetPassword")}>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Entrer le mot de passe"
          style={[styles.input, passwordFocused && styles.inputFocused]}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.socialDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou avec</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image source={require("../assets/fonts/google.png")} style={styles.socialIcon} />
          <Text style={[styles.socialText, styles.googleText]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Image source={require("../assets/fonts/facebook.png")} style={styles.socialIcon} />
          <Text style={[styles.socialText, styles.facebookText]}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 15,
    color: "#888",
  },
  activeTabText: {
    fontSize: 15,
    fontWeight: "bold",
    color: GREEN_800,
  },
  form: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  link: {
    color: GREEN_800,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  inputFocused: {
    borderColor: GREEN_800,
    shadowColor: GREEN_800,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: GREEN_800,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  socialDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#666",
    fontSize: 13,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  socialIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  socialText: {
    fontSize: 13,
    fontWeight: "600",
  },
  googleText: {
    color: "#444",
  },
  facebookText: {
    color: "#fff",
  },
});

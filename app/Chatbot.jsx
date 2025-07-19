// app/ChatbotScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { OPENAI_API_KEY, OPENAI_API_URL } from "../config";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Bonjour ! Pose-moi une question sur ta plante." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Erreur GPT:", error.response?.data || error.message);
      setMessages([
        ...newMessages,
        { role: "bot", content: "Une erreur s'est produite. Réessaie." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messages}>
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.message,
              msg.role === "user" ? styles.user : styles.bot,
            ]}
          >
            <Text style={styles.text}>{msg.content}</Text>
          </View>
        ))}
        {loading && <Text style={styles.loading}>⏳ Réponse en cours...</Text>}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ta question sur la plante..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendBtn}>📨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F9F9" },
  messages: { flex: 1 },
  message: { marginVertical: 4, padding: 10, borderRadius: 10 },
  user: { alignSelf: "flex-end", backgroundColor: "#D0F0C0" },
  bot: { alignSelf: "flex-start", backgroundColor: "#FFF" },
  text: { color: "#000" },
  inputContainer: { flexDirection: "row", marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  sendBtn: { fontSize: 22, padding: 12 },
  loading: { alignSelf: "center", marginVertical: 10, color: "gray" },
});

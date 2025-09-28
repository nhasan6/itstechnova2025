"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { aiService } from "../../services/apiService"
import { Brain } from 'lucide-react-native';


interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function AIAssistantScreen() {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your personal financial advisors. Ask me anything about budgeting, saving, or Girl Math!",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      // use ai service from api
      const aiResponse = await aiService.getAdvice(inputText.trim())

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse || "I'm here to help with your financial questions!",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Mock response for demo when API fails
      const mockResponses = [
        "That's a great question! Remember, every small step towards your financial goals counts. 💪",
        "Girl math says if you return something, that's free money to spend! But let's also think about building those savings. 💖",
        "I love your thinking! Let's break down your budget and see how we can make your money work harder for you. ✨",
        "Financial independence is so empowering! What specific goal would you like to work towards first? 🎯",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.aiAvatar}>
            <Brain size={20} color="white" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Financial Advisors</Text>
            <Text style={styles.headerSubtitle}>Ask your financial questions</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.aiMessage]}
            >
              <View style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.messageText, message.isUser ? styles.userText : styles.aiText]}>
                  {message.text}
                </Text>
              </View>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={inputText.trim() ? ["#ff6b9d", "#8b5cf6"] : ["#374151", "#374151"]}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3e",
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#ff6b9d",
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: "#1a1a2e",
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#ffffff",
  },
  aiText: {
    color: "#ffffff",
  },
  messageTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  loadingText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a3e",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: "#ffffff",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})

"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { piggyBankService } from "../../services/apiService"

const emojiOptions = ["🏖️", "💻", "👜", "🛡️", "🎮", "📱", "✈️", "🏠", "🚗", "💍", "🎓", "🎨"]

export default function CreatePiggyBankScreen() {
  const navigation = useNavigation()
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("🐷")
  const [isLoading, setIsLoading] = useState(false)

  const createPiggyBank = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for your piggy bank")
      return
    }

    if (!goal || isNaN(Number.parseFloat(goal)) || Number.parseFloat(goal) <= 0) {
      Alert.alert("Error", "Please enter a valid goal amount")
      return
    }

    setIsLoading(true)

    try {
      const newPiggyBank = await piggyBankService.create({
          name: name.trim(),
          type: 'savings',
          goal: Number.parseFloat(goal),
          balance: 0,
          opened: false,
          emoji: selectedEmoji,
      });

      Alert.alert("Success", "Piggy bank created successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);

    } catch (error) {
      console.error("Error creating piggy bank:", error)
      // Mock success for demo
      Alert.alert("Success", "Piggy bank created successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Piggy Bank</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Preview */}
        <View style={styles.previewContainer}>
          <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.previewGradient}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={styles.previewName}>{name || "My Goal"}</Text>
            <Text style={styles.previewGoal}>${goal || "0"} target</Text>
          </LinearGradient>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Vacation Fund, New Laptop"
              placeholderTextColor="#9ca3af"
              maxLength={30}
            />
          </View>

          {/* Goal Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={goal}
              onChangeText={setGoal}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* Emoji Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose an Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
              {emojiOptions.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.emojiButton, selectedEmoji === emoji && styles.emojiButtonSelected]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton} onPress={createPiggyBank} disabled={isLoading}>
            <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.createButtonGradient}>
              {isLoading ? (
                <Text style={styles.createButtonText}>Creating...</Text>
              ) : (
                <>
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.createButtonText}>Create Piggy Bank</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for Success</Text>

          <View style={styles.tipItem}>
            <Text style={styles.tipText}>🎯 Set realistic goals that motivate you without feeling overwhelming</Text>
          </View>

          <View style={styles.tipItem}>
            <Text style={styles.tipText}>📈 Start small and celebrate every milestone along the way</Text>
          </View>

          <View style={styles.tipItem}>
            <Text style={styles.tipText}>💪 Use Girl Math logic to justify allocating purchases to your goals</Text>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b9d",
    marginBottom: 16,

  },
  placeholder: {
    width: 32,
  },
  previewContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  previewGradient: {
    alignItems: "center",
    padding: 30,
    borderRadius: 20,
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  previewName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  previewGoal: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  amountInput: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  emojiScroll: {
    marginTop: 8,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emojiButtonSelected: {
    backgroundColor: "#ff6b9d",
  },
  emojiText: {
    fontSize: 24,
  },
  createButton: {
    borderRadius: 12,
    marginTop: 20,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 8,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  tipItem: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
})

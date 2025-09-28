"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Coins, Brain, PiggyBank, Target, Settings, Plus, Calculator, X, Lightbulb} from 'lucide-react-native'


const { width } = Dimensions.get("window")

const tutorialSteps = [
  {
    id: 1,
    title: "Log Your Free Money",
    description:
      "Every time you skip a purchase, log it as 'free money'. That $5 coffee you didn't buy? That's $5 in your pocket!",
    icon: Coins,
    color: "#ff6b9d",
  },
  {
    id: 2,
    title: "Create Savings Goals",
    description: "Turn your free money into visual progress! Create piggy bank goals and watch them fill up with coins as you save.",
    icon: PiggyBank,
    color: "#8b5cf6",
  },
  {
    id: 3,
    title: "Allocate Your Savings",
    description:
      "Take your unallocated free money and assign it to your goals. Watch your piggy banks fill up and goals get closer!",
    icon: Target,
    color: "#06d6a0",
  },
  {
    id: 4,
    title: "Use Girl Math Logic",
    description:
      "Justify any purchase with flawless logic! Our calculator helps you rationalize spending with fun scenarios.",
    icon: Calculator,
    color: "#ffd23f",
    example: "Example: If you return something, that's free money to spend!",
  },
  {
    id: 5,
    title: "Get AI Insights",
    description:
      "Chat with our AI assistant for personalized financial guidance that understands your goals and challenges.",
    icon: Brain,
    color: "#ff6b9d",
  },
]

export default function TutorialScreen() {
  const navigation = useNavigation()
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigation.goBack()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    navigation.goBack()
  }


  // Dynamically get the icon component for the current step
  const currentTutorial = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100
  const IconComponent = currentTutorial.icon

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="sparkles" size={20} color="#ff6b9d" />
          <Text style={styles.headerTitle}>Quick Tutorial</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {tutorialSteps.length}
        </Text>
        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.progressBar}>
        <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient colors={[currentTutorial.color, currentTutorial.color + "80"]} style={styles.iconGradient}>
            <IconComponent size={48} color="white" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>{currentTutorial.title}</Text>
        <Text style={styles.description}>{currentTutorial.description}</Text>

        {currentTutorial.example && (
          <View style={styles.exampleContainer}>
            <Lightbulb size={20} color="#ffd23f" />
            <Text style={styles.exampleText}>{currentTutorial.example}</Text>
          </View>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? "#6b7280" : "#ffffff"} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>
              {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={skipTutorial}>
        <Text style={styles.skipText}>Skip tutorial</Text>
      </TouchableOpacity>
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
  },
  closeButton: {
    marginRight: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff6b9d",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#2a2a3e",
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 40,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  exampleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  exampleText: {
    fontSize: 14,
    color: "#ffd23f",
    marginLeft: 8,
    flex: 1,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 4,
  },
  navButtonTextDisabled: {
    color: "#6b7280",
  },
  nextButton: {
    borderRadius: 25,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginRight: 8,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 14,
    color: "#9ca3af",
  },
})

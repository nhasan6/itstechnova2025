"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { piggyBankService } from "../../services/apiService"

const { width } = Dimensions.get("window")

interface PiggyBank {
  _id: string
  name: string
  goal: number
  balance: number
  opened: boolean
  emoji?: string
}

export default function GoalsScreen() {
  const navigation = useNavigation()
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([])

  // Fetch data when screen comes into focus
   useFocusEffect(
    useCallback(() => {
      fetchPiggyBanks();
    }, [])
  );

  useEffect(() => {
    fetchPiggyBanks();

     // Set up auto-refresh every 30 seconds
     const interval = setInterval(() => {
      fetchPiggyBanks();
    }, 30000);

        return () => clearInterval(interval);

  }, [])

  const fetchPiggyBanks = async () => {
    try {
      const data = await piggyBankService.getAll()
      setPiggyBanks(data)
    } catch (error) {
      console.error("Error fetching piggy banks:", error)
      // Mock data for demo
      setPiggyBanks([
        { _id: "1", name: "Vacation Fund", goal: 2000, balance: 850, opened: false, emoji: "🏖️" },
        { _id: "2", name: "New Laptop", goal: 1500, balance: 1200, opened: false, emoji: "💻" },
        { _id: "3", name: "Emergency Fund", goal: 5000, balance: 2300, opened: false, emoji: "🛡️" },
        { _id: "4", name: "Designer Bag", goal: 800, balance: 800, opened: false, emoji: "👜" },
      ])
    }
  }

  const openPiggyBank = async (piggyBankId: string) => {
    try {
      await piggyBankService.update(piggyBankId, { opened: true })
      fetchPiggyBanks() // Refresh the list
    } catch (error) {
      console.error("Error opening piggy bank:", error)
    }
  }

  const renderPiggyBank = (bank: PiggyBank) => {
    const progress = (bank.balance / bank.goal) * 100
    const isComplete = progress >= 100

    return (
      <View key={bank._id} style={styles.piggyBankCard}>
        <View style={styles.piggyBankHeader}>
          <View style={styles.piggyBankInfo}>
            <Text style={styles.piggyBankEmoji}>{bank.emoji || "🐷"}</Text>
            <View style={styles.piggyBankDetails}>
              <Text style={styles.piggyBankName}>{bank.name}</Text>
              <Text style={styles.piggyBankAmount}>
                ${bank.balance.toFixed(2)} / ${bank.goal.toFixed(2)}
              </Text>
            </View>
          </View>
          {isComplete && !bank.opened && (
            <TouchableOpacity style={styles.openButton} onPress={() => openPiggyBank(bank._id)}>
              <LinearGradient colors={["#06d6a0", "#00b894"]} style={styles.openButtonGradient}>
                <Text style={styles.openButtonText}>Open! 🎉</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={isComplete ? ["#06d6a0", "#00b894"] : ["#ff6b9d", "#8b5cf6"]}
              style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
            />
          </View>
          <Text style={[styles.progressText, isComplete && styles.completeText]}>{Math.round(progress)}%</Text>
        </View>

        {isComplete && (
          <View style={styles.completeMessage}>
            <Text style={styles.completeText}>🎯 Goal achieved! Time to celebrate!</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Piggy Banks</Text>
          <Text style={styles.subtitle}>Track your savings goals with visual progress</Text>
        </View>

        {/* Create New Button */}
        <View style={styles.createSection}>
          <TouchableOpacity style={styles.createCard} onPress={() => navigation.navigate("CreatePiggyBank" as never)}>
            <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.createCardGradient}>
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.createCardText}>Create New Piggy Bank</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Piggy Banks List */}
        {piggyBanks.length > 0 ? (
          <View style={styles.piggyBanksList}>{piggyBanks.map(renderPiggyBank)}</View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyEmoji}>🐷</Text>
            </View>
            <Text style={styles.emptyTitle}>No piggy banks yet!</Text>
            <Text style={styles.emptySubtitle}>Create your first piggy bank to start saving with visual progress.</Text>
            <Text style={styles.emptyMotivation}>Whether it's for treats, savings, or fun - every goal counts!</Text>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Saving Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Set realistic goals and celebrate small wins! Every dollar saved is progress. 💪
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Use the "Girl Math" logic: if you return something, that's free money for your goals! 🛍️
            </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6b9d",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  createSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  createCard: {
    borderRadius: 16,
  },
  createCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
  },
  createCardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 12,
  },
  piggyBanksList: {
    paddingHorizontal: 20,
  },
  piggyBankCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  piggyBankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  piggyBankInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  piggyBankEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  piggyBankDetails: {
    flex: 1,
  },
  piggyBankName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  piggyBankAmount: {
    fontSize: 14,
    color: "#9ca3af",
  },
  openButton: {
    borderRadius: 12,
  },
  openButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#2a2a3e",
    borderRadius: 6,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff6b9d",
    minWidth: 40,
  },
  completeText: {
    color: "#06d6a0",
  },
  completeMessage: {
    backgroundColor: "rgba(6, 214, 160, 0.1)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMotivation: {
    fontSize: 14,
    color: "#ff6b9d",
    textAlign: "center",
    fontStyle: "italic",
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
})

"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { transactionService, piggyBankService } from "../../services/apiService"
import { ArrowRight, CheckCircle, Heart, ShoppingBag, Sparkles, PiggyBank } from 'lucide-react-native';

const categoryIcons = {
    treat: ShoppingBag,
    savings: PiggyBank,
    fun: Sparkles,
    selfcare: Heart,
    custom: PiggyBank,
  };

  const categoryColors = {
    treat: 'from-pink-400 to-pink-600',
    savings: 'from-emerald-400 to-emerald-600',
    fun: 'from-purple-400 to-purple-600',
    selfcare: 'from-yellow-400 to-yellow-600',
    custom: 'from-indigo-400 to-indigo-600',
  };

interface Transaction {
  _id: string
  amount: number
  label: string
  source: string
  note?: string
  piggyBankId?: string
  createdAt: string
  updatedAt: string
}

interface PiggyBank {
  _id: string
  name: string
  goal: number
  balance: number
  opened: boolean
  emoji?: string
}

export default function AllocateScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
    fetchPiggyBanks()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      // Only show unallocated transactions that haven't been logged yet
      const unallocatedExpenses = data.filter((t: Transaction) => !t.piggyBankId);
      setTransactions(unallocatedExpenses);
    } catch (error) {
      // Mock data for demo
      setTransactions([
        { _id: "1", amount: -25.5, label: "Coffee & Pastry", source: "manual", note: "Category: Food", createdAt: "2024-01-15", updatedAt: "2024-01-15" },
        { _id: "2", amount: -120.0, label: "New Dress", source: "manual", note: "Category: Shopping", createdAt: "2024-01-14", updatedAt: "2024-01-14" },
        { _id: "4", amount: -45.0, label: "Uber Ride", source: "manual", note: "Category: Transport", createdAt: "2024-01-12", updatedAt: "2024-01-12" },
      ])
    }
  }

  const fetchPiggyBanks = async () => {
    try {
      const data = await piggyBankService.getAll();
      // Only show unopened piggy banks
      const unopenedBanks = data.filter((bank: PiggyBank) => !bank.opened);
      setPiggyBanks(unopenedBanks);
    } catch (error) {
      console.error("Error fetching piggy banks:", error)
      // Mock data for demo
      setPiggyBanks([
        { _id: "1", name: "Vacation Fund", goal: 2000, balance: 850, opened: false, emoji: "🏖️" },
        { _id: "2", name: "New Laptop", goal: 1500, balance: 1200, opened: false, emoji: "💻" },
        { _id: "3", name: "Emergency Fund", goal: 5000, balance: 2300, opened: false, emoji: "🛡️" },
      ])
    }
  }

  const allocateTransaction = async (transactionId: string, piggyBankId: string) => {
    setIsLoading(true)

    try {
      await transactionService.allocate(transactionId, piggyBankId);
      
      Alert.alert("Success", "Transaction allocated successfully!")
      fetchTransactions()
      fetchPiggyBanks()
      setSelectedTransaction(null)
    } catch (error) {
      console.error("Error allocating transaction:", error)
      console.error("❌ Error details:", error.response?.data);
      console.error("❌ Status code:", error.response?.status);
      
      Alert.alert("Error", "Failed to allocate transaction. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryFromNote = (note?: string) => {
    if (!note) return "Other";
    const match = note.match(/Category: (.+)/);
    return match ? match[1] : "Other";
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "#ff6b9d",
      Shopping: "#8b5cf6",
      Transport: "#06d6a0",
      Entertainment: "#ffd23f",
      Bills: "#ef4444",
      Other: "#9ca3af",
    }
    return colors[category] || colors["Other"]
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Allocate Spending</Text>
          <Text style={styles.subtitle}>Assign purchases to your savings goals</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <LinearGradient colors={["#ff6b9d20", "#8b5cf620"]} style={styles.instructionsGradient}>
            <Ionicons name="information-circle" size={24} color="#ff6b9d" />
            <Text style={styles.instructionsText}>
              Select a purchase below, then choose which piggy bank to allocate it to. This helps track what your
              savings are really for! 💡
            </Text>
          </LinearGradient>
        </View>

        {/* Unallocated Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Saves</Text>

          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction._id}
                style={[
                  styles.transactionItem,
                  selectedTransaction === transaction._id && styles.transactionItemSelected,
                ]}
                onPress={() => setSelectedTransaction(selectedTransaction === transaction._id ? null : transaction._id)}
              >
                <View
                  style={[styles.transactionIcon, { backgroundColor: getCategoryColor(getCategoryFromNote(transaction.note)) + "20" }]}
                >
                  <Ionicons name="card" size={20} color={getCategoryColor(getCategoryFromNote(transaction.note))} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.label}</Text>
                  <Text style={styles.transactionMeta}>
                    {formatDate(transaction.createdAt)} • {getCategoryFromNote(transaction.note)}
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>${Math.abs(transaction.amount).toFixed(2)}</Text>
                  <Ionicons
                    name={selectedTransaction === transaction._id ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#9ca3af"
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={48} color="#06d6a0" />
              <Text style={styles.emptyTitle}>All caught up! ✨</Text>
              <Text style={styles.emptySubtitle}>No unallocated purchases. Great job staying organized!</Text>
            </View>
          )}
        </View>

        {/* Piggy Banks Selection */}
        {selectedTransaction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose a Piggy Bank</Text>

            {piggyBanks.map((bank) => {
              const progress = (bank.balance / bank.goal) * 100
              return (
                <TouchableOpacity
                  key={bank._id}
                  style={styles.piggyBankItem}
                  onPress={() => allocateTransaction(selectedTransaction, bank._id)}
                  disabled={isLoading}
                >
                  <View style={styles.piggyBankHeader}>
                    <Text style={styles.piggyBankEmoji}>{bank.emoji || "🐷"}</Text>
                    <View style={styles.piggyBankInfo}>
                      <Text style={styles.piggyBankName}>{bank.name}</Text>
                      <Text style={styles.piggyBankAmount}>
                        ${bank.balance.toFixed(2)} / ${bank.goal.toFixed(2)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={["#ff6b9d", "#8b5cf6"]}
                        style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {/* Girl Math Tip */}
        <View style={styles.tipContainer}>
          <LinearGradient colors={["#ffd23f20", "#ff6b9d20"]} style={styles.tipGradient}>
            <Text style={styles.tipTitle}>💡 Girl Math Tip</Text>
            <Text style={styles.tipText}>
              Allocating purchases to goals helps you see what you're really saving for. That coffee? It's an investment
              in your vacation fund! ☕️✈️
            </Text>
          </LinearGradient>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructionsGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 12,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionItemSelected: {
    backgroundColor: "#2a2a3e",
    borderWidth: 2,
    borderColor: "#ff6b9d",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  transactionMeta: {
    fontSize: 12,
    color: "#9ca3af",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b9d",
    marginBottom: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  piggyBankItem: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  piggyBankHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  piggyBankEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  piggyBankInfo: {
    flex: 1,
  },
  piggyBankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  piggyBankAmount: {
    fontSize: 12,
    color: "#9ca3af",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#2a2a3e",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff6b9d",
    minWidth: 35,
  },
  tipContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tipGradient: {
    padding: 16,
    borderRadius: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
})

"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { transactionService, piggyBankService } from "../../services/apiService"
import { Brain, Calculator } from 'lucide-react-native';
import { Home, Coins, PiggyBank, TrendingUp, Target, Settings, Plus } from 'lucide-react-native'



const { width } = Dimensions.get("window")

interface Transaction {
  _id: string
  amount: number
  label: string
  source: string
  date: string
  piggyBankId?: string
}

interface PiggyBank {
  _id: string
  name: string
  goal: number
  balance: number
  opened: boolean
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([])
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    fetchTransactions()
    fetchPiggyBanks()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll()
      setTransactions(data.slice(0, 5)) // Show only recent 5
    } catch (error) {
      console.error("Error fetching transactions:", error)
      // Mock data for demo
      setTransactions([
        { _id: "1", amount: 25.5, label: "Walked instead of Uber", source: "Transport Savings", date: "2024-01-15" },
        { _id: "2", amount: 120.0, label: "E-transfer from Mom", source: "Free Money", date: "2024-01-14" },
        { _id: "3", amount: 45.0, label: "Found $20 + returned item", source: "Found Money", date: "2024-01-13" },
      ])
    }
  }

  const fetchPiggyBanks = async () => {
    try {
      console.log('🏦 Fetching piggy banks...');
      const data = await piggyBankService.getAll()
      console.log('🏦 Piggy banks received:', data);
      setPiggyBanks(data)
      const total = data.reduce((sum: number, bank: PiggyBank) => sum + bank.balance, 0)
      setTotalBalance(total)
    } catch (error) {
      console.error("❌ Error fetching piggy banks:", error)
      console.error("❌ Error details:", error.response?.data);
      console.error("❌ Status code:", error.response?.status);
      console.error("❌ Request URL:", error.config?.url);
      // Mock data for demo
      setPiggyBanks([
        { _id: "1", name: "Vacation Fund", goal: 2000, balance: 850, opened: false },
        { _id: "2", name: "New Laptop", goal: 1500, balance: 1200, opened: false },
      ])
      setTotalBalance(2050)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Girl Math</Text>
            <Text style={styles.subtitle}>Making money decisions fun & guilt free</Text>
          </View>
          <TouchableOpacity style={styles.aiButton} onPress={() => navigation.navigate("AIAssistant" as never)}>
            <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.aiButtonGradient}>
              <Brain size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Balance Card
        <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Savings</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
          <Text style={styles.balanceSubtext}>{piggyBanks.length} active goals 🌟</Text>
        </LinearGradient> */}

      <View style={styles.balanceCards}>
  {/* Free Money Card */}
  <View style={styles.balanceCard}>
    <View style={styles.balanceHeader}>
      <View style={styles.balanceIconContainer}>
        <Coins size={16} color="#ff6b9d" />
      </View>
      <Text style={styles.balanceLabel}>Free Money</Text>
    </View>
    <Text style={styles.balanceAmount}>
      ${transactions.filter(t => !t.piggyBankId).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
    </Text>
    <Text style={styles.balanceSubtext}>Ready to allocate</Text>
  </View>

  {/* Total Earned Card */}
  <View style={styles.balanceCard}>
    <View style={styles.balanceHeader}>
      <View style={styles.balanceIconContainer}>
        <TrendingUp size={16} color="#2563eb" />
      </View>
      <Text style={styles.balanceLabel}>Total Earned</Text>
    </View>
    <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
    <Text style={styles.balanceSubtext}>Keep it up!</Text>
  </View>
</View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Log" as never)}>
              <View style={styles.actionIcon}>
                <Plus size={24} color="#ff6b9d" />
                {/* <Ionicons name="add-circle" size={24} color="#ff6b9d" /> */}
              </View>
              <Text style={styles.actionText}>Log Free Money!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Goals" as never)}>
              <View style={styles.actionIcon}>
                <PiggyBank size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>New Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Tutorial" as never)}>
              <View style={styles.actionIcon}>
                <Calculator size={24} color="#06d6a0" />
              </View>
              <Text style={styles.actionText}>Girl Math Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("AIAssistant" as never)}>
              <View style={styles.actionIcon}>
                <Brain size={24} color="#ffd23f" />
              </View>
              <Text style={styles.actionText}>AI Advisor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Wins</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Log" as never)}>
              <Text style={styles.seeAll}>See More</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction._id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color="#06d6a0"
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{transaction.label}</Text>
                <Text style={styles.transactionCategory}>{transaction.source}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: "#06d6a0" }]}>{transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)} </Text>
            </View>
          ))}
        </View>

        {/* Piggy Banks Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Goals" as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {piggyBanks.slice(0, 2).map((bank) => (
            <View key={bank._id} style={styles.piggyBankItem}>
              <View style={styles.piggyBankInfo}>
                <Text style={styles.piggyBankName}>{bank.name}</Text>
                <Text style={styles.piggyBankProgress}>
                  ${bank.balance} / ${bank.goal}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={["#ff6b9d", "#8b5cf6"]}
                    style={[styles.progressFill, { width: `${(bank.balance / bank.goal) * 100}%` }]}
                  />
                </View>
                <Text style={styles.progressPercent}>{Math.round((bank.balance / bank.goal) * 100)}%</Text>
              </View>
            </View>
          ))}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b9d",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
  },
  aiButton: {
    borderRadius: 25,
  },
  aiButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
balanceCards: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
balanceCard: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.2)",
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  balanceIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 157, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: "#9ca3af",
  },

  // },
  // balanceCard: {
  //   marginHorizontal: 20,
  //   marginBottom: 30,
  //   padding: 24,
  //   borderRadius: 20,
  //   alignItems: "center",
  // },
  // balanceLabel: {
  //   fontSize: 16,
  //   color: "rgba(255, 255, 255, 0.8)",
  //   marginBottom: 8,
  // },
  // balanceAmount: {
  //   fontSize: 36,
  //   fontWeight: "bold",
  //   color: "#ffffff",
  //   marginBottom: 8,
  // },
  // balanceSubtext: {
  //   fontSize: 14,
  //   color: "rgba(255, 255, 255, 0.7)",
  // },

  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b9d",
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.2)"
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 107, 157, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: "#ff6b9d",
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 157, 0.1)",
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
  transactionCategory: {
    fontSize: 14,
    color: "#9ca3af",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  piggyBankItem: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  piggyBankInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  piggyBankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  piggyBankProgress: {
    fontSize: 14,
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
  progressPercent: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff6b9d",
    minWidth: 35,
  },
})

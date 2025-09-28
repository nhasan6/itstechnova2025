"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { transactionService } from "../../services/apiService"
import { DollarSign, Coins, TrendingUp, Plus, CheckCircle } from 'lucide-react-native'

interface Transaction {
  _id: string
  amount: number
  label: string
  source: string
  note?: string
  createdAt: string
}

// Preset spending habits for quick logging
const spendingHabits = [
  { id: "1", name: "Coffee", icon: "☕", averageAmount: 5, color: "#8b5cf6" },
  { id: "2", name: "Breakfast", icon: "🥐", averageAmount: 12, color: "#ff6b9d" },
  { id: "3", name: "Lunch Out", icon: "🥗", averageAmount: 15, color: "#06d6a0" },
  { id: "4", name: "Uber Ride", icon: "🚗", averageAmount: 18, color: "#ffd23f" },
  { id: "5", name: "Shopping", icon: "🛍️", averageAmount: 50, color: "#ff6b9d" },
  { id: "6", name: "Entertainment", icon: "🎬", averageAmount: 25, color: "#8b5cf6" },
]

export default function LogScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Custom form fields
  const [customAmount, setCustomAmount] = useState("")
  const [customLabel, setCustomLabel] = useState("")
  const [customNote, setCustomNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      console.log('💳 Fetching transactions...');
      const data = await transactionService.getAll();
      console.log('💳 Transactions received:', data.length, 'transactions');
      
      // Filter for manual transactions (not allocated)
      const manualTransactions = data.filter((t: Transaction) => t.source === 'manual' || t.source === 'skipped');
      setTransactions(manualTransactions.slice(0, 10)); // Show recent 10
    } catch (error) {
      console.error("❌ Error fetching transactions:", error)
      // Mock data for demo - girl math style!
      setTransactions([
        { _id: "1", amount: 25.5, label: "Skipped Coffee", source: "skipped", note: "Saved money by making coffee at home", createdAt: "2024-01-15T10:00:00Z" },
        { _id: "2", amount: 120.0, label: "E-transfer from Mom", source: "manual", note: "Birthday money - basically free!", createdAt: "2024-01-14T15:30:00Z" },
        { _id: "3", amount: 45.0, label: "Walked instead of Uber", source: "skipped", note: "Got exercise AND saved money", createdAt: "2024-01-13T09:15:00Z" },
      ])
    }
  }

  const handleQuickLog = async (habit: typeof spendingHabits[0]) => {
    setIsLoading(true)
    
    try {
      console.log('🎯 Quick logging habit:', habit.name);
      
      const transactionData = {
        amount: habit.averageAmount,
        label: `Skipped ${habit.name}`,
        source: 'skipped',
        note: `Saved money by not buying ${habit.name.toLowerCase()}`,
      }
      
      console.log('🎯 Sending quick log data:', transactionData);
      const newTransaction = await transactionService.create(transactionData)
      console.log('🎯 Quick log successful:', newTransaction);
      
      setTransactions((prev) => [newTransaction, ...prev])
      showSuccessMessage()
      
    } catch (error) {
      console.error("❌ Error quick logging:", error)
      Alert.alert("Error", "Failed to log transaction. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomLog = async () => {
    if (!customAmount || !customLabel) {
      Alert.alert("Error", "Please fill in amount and description")
      return
    }

    const numAmount = Number.parseFloat(customAmount)
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid positive amount")
      return
    }

    setIsLoading(true)

    try {
      console.log('💳 Creating custom transaction...');
      
      const transactionData = {
        amount: numAmount,
        label: customLabel.trim(),
        source: 'manual',
        note: customNote.trim() || undefined,
      }
      
      console.log('💳 Sending custom transaction:', transactionData);
      const newTransaction = await transactionService.create(transactionData)
      console.log('💳 Custom transaction successful:', newTransaction);
      
      setTransactions((prev) => [newTransaction, ...prev])
      setCustomAmount("")
      setCustomLabel("")
      setCustomNote("")
      setShowCustomForm(false)
      showSuccessMessage()
      
    } catch (error) {
      console.error("❌ Error creating custom transaction:", error)
      Alert.alert("Error", "Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Log Your Free Money</Text>
          <Text style={styles.subtitle}>What did you save or skip today?</Text>
        </View>

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successMessage}>
            <LinearGradient colors={["#10b981", "#059669"]} style={styles.successGradient}>
              <CheckCircle size={24} color="white" />
              <Text style={styles.successText}>Money logged successfully! 🎉</Text>
            </LinearGradient>
          </View>
        )}

        {/* Quick Log Buttons */}
        <View style={styles.quickLogSection}>
          <View style={styles.habitsGrid}>
            {spendingHabits.map((habit, index) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitButton, { backgroundColor: habit.color + "20", borderColor: habit.color + "40" }]}
                onPress={() => handleQuickLog(habit)}
                disabled={isLoading}
              >
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={[styles.habitAmount, { color: habit.color }]}>${habit.averageAmount}</Text>
                <View style={[styles.habitShimmer, { backgroundColor: habit.color + "30" }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Entry */}
        <View style={styles.customSection}>
          <View style={styles.customCard}>
            <Text style={styles.customTitle}>
              <Plus size={20} color="#ff6b9d" /> Custom Entry
            </Text>
            
            {!showCustomForm ? (
              <TouchableOpacity 
                style={styles.customButton} 
                onPress={() => setShowCustomForm(true)}
                disabled={isLoading}
              >
                <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.customButtonGradient}>
                  <Plus size={24} color="white" />
                  <Text style={styles.customButtonText}>Add Custom Amount</Text>
                  <Text style={styles.customButtonSparkle}>✨</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.customForm}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Amount ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="0.00"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.formLabel}>What did you save on?</Text>
                  <TextInput
                    style={styles.formInput}
                    value={customLabel}
                    onChangeText={setCustomLabel}
                    placeholder="e.g., Skipped dinner out"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Note (optional)</Text>
                  <TextInput
                    style={[styles.formInput, styles.textArea]}
                    value={customNote}
                    onChangeText={setCustomNote}
                    placeholder="Any additional details..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={[styles.formButton, styles.logButton]} 
                    onPress={handleCustomLog}
                    disabled={!customAmount || !customLabel || isLoading}
                  >
                    <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.formButtonGradient}>
                      <Text style={styles.formButtonText}>
                        {isLoading ? "Logging..." : "Log Money 💰"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.formButton, styles.cancelButton]} 
                    onPress={() => setShowCustomForm(false)}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Free Money Wins! 💰</Text>

          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View key={transaction._id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={transaction.source === 'skipped' ? 'checkmark-circle' : 'trending-up'} 
                    size={20} 
                    color="#10b981" 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLabel}>{transaction.label}</Text>
                  <Text style={styles.transactionMeta}>
                    {formatDate(transaction.createdAt)} • {transaction.source === 'skipped' ? 'Skipped' : 'Free Money'}
                  </Text>
                  {transaction.note && (
                    <Text style={styles.transactionNote}>{transaction.note}</Text>
                  )}
                </View>
                <Text style={styles.transactionAmount}>+${transaction.amount.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No free money logged yet!</Text>
              <Text style={styles.emptySubtext}>Start by skipping something above! ☕️➡️💰</Text>
            </View>
          )}
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
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  sparkleIcon: {
    margin: 2,
  },
  sparkleDelay1: {},
  sparkleDelay2: {},
  successMessage: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  successGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  quickLogSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  habitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  habitButton: {
    width: "48%",
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
    overflow: "hidden",
  },
  habitIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  habitAmount: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  habitShimmer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  customSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  customCard: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 157, 0.2)", 
  },
  customTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff6b9d",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customButton: {
    borderRadius: 12,
  },
  customButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  customButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  customButtonSparkle: {
    fontSize: 16,
  },
  customForm: {
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff6b9d",
  },
  formInput: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    borderRadius: 12,
  },
  logButton: {},
  formButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  cancelButton: {
    backgroundColor: "#2a2a3e",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9ca3af",
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  transactionMeta: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  transactionNote: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
})

// "use client"

// import { useState, useEffect } from "react"
// import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"
// import { LinearGradient } from "expo-linear-gradient"
// import { Ionicons } from "@expo/vector-icons"
// import { transactionService } from "../../services/apiService"
// import { DollarSign, Coins, TrendingUp } from 'lucide-react-native'



// interface Transaction {
//   _id: string
//   amount: number
//   description: string
//   category: string
//   date: string
//   piggyBankId?: string
// }

// const categories = [
//   { name: "Food", icon: "restaurant", color: "#ff6b9d" },
//   { name: "Shopping", icon: "bag", color: "#8b5cf6" },
//   { name: "Transport", icon: "car", color: "#06d6a0" },
//   { name: "Entertainment", icon: "game-controller", color: "#ffd23f" },
//   { name: "Bills", icon: "receipt", color: "#ef4444" },
//   { name: "Income", icon: "trending-up", color: "#10b981" },
//   { name: "Other", icon: "ellipsis-horizontal", color: "#9ca3af" },
// ]

// export default function LogScreen() {
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [amount, setAmount] = useState("")
//   const [description, setDescription] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("Food")
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     fetchTransactions()
//   }, [])

//   const fetchTransactions = async () => {
//     try {
//       const data = await transactionService.getAll()
//       setTransactions(data)
//     } catch (error) {
//       console.error("Error fetching transactions:", error)
//       // Mock data for demo
//       setTransactions([
//         { _id: "1", amount: -25.5, description: "Coffee & Pastry", category: "Food", date: "2024-01-15" },
//         { _id: "2", amount: -120.0, description: "New Dress", category: "Shopping", date: "2024-01-14" },
//         { _id: "3", amount: 500.0, description: "Salary", category: "Income", date: "2024-01-13" },
//         { _id: "4", amount: -45.0, description: "Uber Ride", category: "Transport", date: "2024-01-12" },
//       ])
//     }
//   }

//   const addTransaction = async () => {
//     if (!amount || !description) {
//       Alert.alert("Error", "Please fill in all fields")
//       return
//     }

//     const numAmount = Number.parseFloat(amount)
//     if (isNaN(numAmount)) {
//       Alert.alert("Error", "Please enter a valid amount")
//       return
//     }

//     setIsLoading(true)

//     try {
//       console.log('💳 Creating transaction...');
      
//       // Prepare transaction data
//       const transactionData = {
//         amount: selectedCategory === "Income" ? numAmount : -numAmount,
//         label: description.trim(), // Backend expects 'label', not 'description'
//         source: 'manual', // Required field - indicates this was manually entered
//         note: `Category: ${selectedCategory}`, // Store category info in note field
//       }
      
//       console.log('💳 Sending transaction data:', transactionData);
//       const newTransaction = await transactionService.create(transactionData)
//       console.log('💳 Transaction created successfully:', newTransaction);
      
//       setTransactions((prev) => [newTransaction, ...prev])
//       setAmount("")
//       setDescription("")
//       Alert.alert("Success", "Transaction added successfully!")
//     } catch (error) {
//       console.error("❌ Error adding transaction:", error)
//       console.error("❌ Error details:", error.response?.data);
//       console.error("❌ Status code:", error.response?.status);
//       console.error("❌ Request URL:", error.config?.url);
//       console.error("❌ Full error object:", JSON.stringify(error, null, 2));
      
//       // Show actual error instead of always showing success
//       Alert.alert("Error", "Failed to add transaction. Please try again.");
      
//       // Mock success for demo (commented out - uncomment if you want demo mode)
//       // const newTransaction: Transaction = {
//       //   _id: Date.now().toString(),
//       //   amount: selectedCategory === "Income" ? numAmount : -numAmount,
//       //   description,
//       //   category: selectedCategory,
//       //   date: new Date().toISOString(),
//       // }
//       // setTransactions((prev) => [newTransaction, ...prev])
//       // setAmount("")
//       // setDescription("")
//       // Alert.alert("Success", "Transaction added successfully!")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getCategoryIcon = (categoryName: string) => {
//     const category = categories.find((cat) => cat.name === categoryName)
//     return category || categories[categories.length - 1] // Default to 'Other'
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Log Your Free Money</Text>
//           <Text style={styles.subtitle}>What did you save or skip today</Text>
//           <View style={styles.iconContainer}>
//             <DollarSign size={20} color="#10b981" style={styles.sparkleIcon} />
//             <Coins size={20} color="#ec4899" style={[styles.sparkleIcon, styles.sparkleDelay1]} />
//             <TrendingUp size={20} color="#f59e0b" style={[styles.sparkleIcon, styles.sparkleDelay2]} />
//           </View>
//         </View>

//         {/* Add Transaction Form */}
//         <View style={styles.formContainer}>
//           <Text style={styles.formTitle}>Add New Transaction</Text>

//           {/* Amount Input */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Amount</Text>
//             <TextInput
//               style={styles.amountInput}
//               value={amount}
//               onChangeText={setAmount}
//               placeholder="0.00"
//               placeholderTextColor="#9ca3af"
//               keyboardType="numeric"
//             />
//           </View>

//           {/* Description Input */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Description</Text>
//             <TextInput
//               style={styles.textInput}
//               value={description}
//               onChangeText={setDescription}
//               placeholder="What did you spend on?"
//               placeholderTextColor="#9ca3af"
//             />
//           </View>

//           {/* Category Selection */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Category</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
//               {categories.map((category) => (
//                 <TouchableOpacity
//                   key={category.name}
//                   style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonSelected]}
//                   onPress={() => setSelectedCategory(category.name)}
//                 >
//                   <Ionicons
//                     name={category.icon as any}
//                     size={20}
//                     color={selectedCategory === category.name ? "#ffffff" : category.color}
//                   />
//                   <Text
//                     style={[styles.categoryText, selectedCategory === category.name && styles.categoryTextSelected]}
//                   >
//                     {category.name}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Add Button */}
//           <TouchableOpacity style={styles.addButton} onPress={addTransaction} disabled={isLoading}>
//             <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.addButtonGradient}>
//               {isLoading ? (
//                 <Text style={styles.addButtonText}>Adding...</Text>
//               ) : (
//                 <>
//                   <Ionicons name="add" size={20} color="white" />
//                   <Text style={styles.addButtonText}>Add Transaction</Text>
//                 </>
//               )}
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Recent Transactions */}
//         <View style={styles.transactionsContainer}>
//           <Text style={styles.transactionsTitle}>Recent Transactions</Text>

//           {transactions.map((transaction) => {
//             const categoryInfo = getCategoryIcon(transaction.category)
//             return (
//               <View key={transaction._id} style={styles.transactionItem}>
//                 <View style={[styles.transactionIcon, { backgroundColor: categoryInfo.color + "20" }]}>
//                   <Ionicons name={categoryInfo.icon as any} size={20} color={categoryInfo.color} />
//                 </View>
//                 <View style={styles.transactionDetails}>
//                   <Text style={styles.transactionDescription}>{transaction.description}</Text>
//                   <Text style={styles.transactionDate}>
//                     {formatDate(transaction.date)} • {transaction.category}
//                   </Text>
//                 </View>
//                 <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? "#06d6a0" : "#ff6b9d" }]}>
//                   {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
//                 </Text>
//               </View>
//             )
//           })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0a0a0a",
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#9ca3af",
//     textAlign: "center",
//   },
//   formContainer: {
//     backgroundColor: "#1a1a2e",
//     marginHorizontal: 20,
//     marginBottom: 30,
//     padding: 20,
//     borderRadius: 16,
//   },
//   formTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#ffffff",
//     marginBottom: 8,
//   },
//   amountInput: {
//     backgroundColor: "#2a2a3e",
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ffffff",
//     textAlign: "center",
//   },
//   textInput: {
//     backgroundColor: "#2a2a3e",
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: "#ffffff",
//   },
//   categoryScroll: {
//     marginTop: 8,
//   },
//   categoryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2a2a3e",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   categoryButtonSelected: {
//     backgroundColor: "#ff6b9d",
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#9ca3af",
//     marginLeft: 8,
//   },
//   categoryTextSelected: {
//     color: "#ffffff",
//   },
//   addButton: {
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   addButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//   },
//   addButtonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginLeft: 8,
//   },
//   transactionsContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   transactionsTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginBottom: 16,
//   },
//   transactionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1a1a2e",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   transactionDetails: {
//     flex: 1,
//   },
//   transactionDescription: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#ffffff",
//     marginBottom: 2,
//   },
//   transactionDate: {
//     fontSize: 12,
//     color: "#9ca3af",
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   iconContainer: {
//   flexDirection: 'row',
//   justifyContent: 'center',
//   alignItems: 'center',
//   gap: 8,
//   marginTop: 8,
// },
// sparkleIcon: {
//   // Add any sparkle animation styles here if needed
// },
// sparkleDelay1: {
//   // Animation delay styles if you want to implement animations
// },
// sparkleDelay2: {
//   // Animation delay styles if you want to implement animations
// },
// })

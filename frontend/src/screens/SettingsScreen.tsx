import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function SettingsScreen() {
  const navigation = useNavigation()

  const handleExportData = () => {
    Alert.alert("Export Data", "Your transaction and savings data will be exported to a CSV file.", [
      { text: "Cancel", style: "cancel" },
      { text: "Export", onPress: () => console.log("Exporting data...") },
    ])
  }

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your transactions and piggy banks. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => console.log("Clearing data..."),
        },
      ],
    )
  }

  const handleAbout = () => {
    Alert.alert(
      "About Girl Math",
      "Girl Math v1.0.0\n\nA fun and empowering way to manage your finances with visual savings goals and AI assistance.\n\nMade with 💕 for financial empowerment.",
      [{ text: "OK" }],
    )
  }

  const settingsOptions = [
    {
      title: "Tutorial",
      subtitle: "Learn how to use Girl Math",
      icon: "school",
      color: "#ff6b9d",
      onPress: () => navigation.navigate("Tutorial" as never),
    },
    {
      title: "AI Assistant",
      subtitle: "Chat with your financial advisor",
      icon: "chatbubble-ellipses",
      color: "#8b5cf6",
      onPress: () => navigation.navigate("AIAssistant" as never),
    },
    {
      title: "Export Data",
      subtitle: "Download your financial data",
      icon: "download",
      color: "#06d6a0",
      onPress: handleExportData,
    },
    {
      title: "Notifications",
      subtitle: "Manage your alerts and reminders",
      icon: "notifications",
      color: "#ffd23f",
      onPress: () => Alert.alert("Coming Soon", "Notification settings will be available in a future update."),
    },
  ]

  const dangerOptions = [
    {
      title: "Clear All Data",
      subtitle: "Permanently delete all transactions and goals",
      icon: "trash",
      color: "#ef4444",
      onPress: handleClearData,
    },
  ]

  const renderSettingItem = (item: any) => (
    <TouchableOpacity key={item.title} style={styles.settingItem} onPress={item.onPress}>
      <View style={[styles.settingIcon, { backgroundColor: item.color + "20" }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your Girl Math experience</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileContainer}>
          <LinearGradient colors={["#ff6b9d", "#8b5cf6"]} style={styles.profileGradient}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileEmoji}>👑</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Financial Queen</Text>
              <Text style={styles.profileSubtext}>Making smart money moves ✨</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {settingsOptions.map(renderSettingItem)}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={[styles.settingIcon, { backgroundColor: "#9ca3af20" }]}>
              <Ionicons name="information-circle" size={20} color="#9ca3af" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>About Girl Math</Text>
              <Text style={styles.settingSubtitle}>Version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          {dangerOptions.map(renderSettingItem)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💕 for financial empowerment</Text>
          <Text style={styles.footerSubtext}>Girl Math - Because every purchase has a story</Text>
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
  profileContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,

  },
  dangerTitle: {
    color: "#ef4444",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 16,
    color: "#ff6b9d",
    marginBottom: 8,
    textAlign: "center",
  },
  footerSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
  },
})

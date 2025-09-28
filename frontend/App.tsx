import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Home, PiggyBank, Target, Settings, Plus } from 'lucide-react-native'

// Import screens
import HomeScreen from "./src/screens/HomeScreen"
import LogScreen from "./src/screens/LogScreen"
import AllocateScreen from "./src/screens/AllocateScreen"
import GoalsScreen from "./src/screens/GoalsScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import AIAssistantScreen from "./src/screens/AIAssistantScreen"
import TutorialScreen from "./src/screens/TutorialScreen"
import CreatePiggyBankScreen from "./src/screens/CreatePiggyBankScreen"

const Tab = createBottomTabNavigator() as any
const Stack = createNativeStackNavigator() as any

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: any

          if (route.name === "Home") {
            iconName = focused ? "Home" : "home-outline"
            return <Home size={size} color={color} />
          } else if (route.name === "Log") {
            iconName = focused ? "add-circle" : "add-circle-outline"
            return <Plus size={size} color={color} />
          } else if (route.name === "Allocate") {
            iconName = focused ? "pie-chart" : "pie-chart-outline"
            return <Target size={size} color={color} />
          } else if (route.name === "Goals") {
            iconName = focused ? "heart" : "heart-outline"
            return <PiggyBank size={size} color={color} />
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
            return <Settings size={size} color={color} />
          } else {
            iconName = "home-outline"
            return <Home size={size} color={color} />
          }
        },
        tabBarActiveTintColor: "#ff6b9d",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopColor: "#2a2a3e",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="Allocate" component={AllocateScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: "#ff6b9d",
            background: "#0a0a0a",
            card: "#1a1a2e",
            text: "#ffffff",
            border: "#2a2a3e",
            notification: "#ff6b9d",
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <StatusBar style="light" backgroundColor="#000000ff" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
          <Stack.Screen name="Tutorial" component={TutorialScreen} />
          <Stack.Screen name="CreatePiggyBank" component={CreatePiggyBankScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

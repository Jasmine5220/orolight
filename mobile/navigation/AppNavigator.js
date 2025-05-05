import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Auth Context
import { AuthContext } from '../utils/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ title: 'Login' }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ title: 'Register' }}
    />
  </Stack.Navigator>
);

// Main App Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Camera') {
          iconName = focused ? 'camera' : 'camera-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3498db',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#2c3e50',
      },
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main App Stack (includes Tabs + Result screen)
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
    }}
  >
    <Stack.Screen 
      name="Main" 
      component={TabNavigator} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Result" 
      component={ResultScreen} 
      options={{ title: 'Analysis Result' }}
    />
  </Stack.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { authState } = useContext(AuthContext);
  
  return (
    authState.authenticated ? <AppStack /> : <AuthStack />
  );
};

export default AppNavigator;

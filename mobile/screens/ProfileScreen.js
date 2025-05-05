import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../utils/auth';

const ProfileScreen = () => {
  const { authState, signOut } = useContext(AuthContext);
  const { user } = authState;

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.username.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'No email'}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="person" size={22} color="#3498db" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user?.username || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="mail" size={22} color="#3498db" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={22} color="#3498db" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString() 
                : 'Unknown'}
            </Text>
          </View>
        </View>

        {user?.is_admin && (
          <View style={styles.infoItem}>
            <Ionicons name="shield" size={22} color="#e74c3c" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Admin</Text>
              <Text style={styles.infoValue}>Yes</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={22} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={22} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={confirmSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#fff" style={styles.actionIcon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 5,
  },
  sectionContainer: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    margin: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  infoValue: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 2,
  },
  actionsContainer: {
    margin: 15,
    marginTop: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c0392b',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  signOutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProfileScreen;

import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../utils/auth';

const HomeScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.username || 'Doctor'}!</Text>
        <Text style={styles.subText}>Medical Image Analysis Platform</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Camera')}
        >
          <View style={styles.cardContent}>
            <Ionicons name="camera" size={40} color="#3498db" />
            <Text style={styles.cardTitle}>Capture Image</Text>
            <Text style={styles.cardDescription}>
              Take a new photo for cancer detection analysis
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('History')}
        >
          <View style={styles.cardContent}>
            <Ionicons name="time" size={40} color="#3498db" />
            <Text style={styles.cardTitle}>View History</Text>
            <Text style={styles.cardDescription}>
              Access your previous analyses and results
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Our Technology</Text>
        <Text style={styles.infoText}>
          Our advanced AI model analyzes medical images to detect potential cancer cells.
          The system provides accurate results with visual heatmaps highlighting areas of concern.
        </Text>
        
        <View style={styles.infoSteps}>
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Take a photo or upload an image</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>AI analyzes the image</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>Review detailed results and heatmap</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 5,
  },
  cardContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 5,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#34495e',
    margin: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#bdc3c7',
    lineHeight: 22,
  },
  infoSteps: {
    marginTop: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#ecf0f1',
    flex: 1,
  },
});

export default HomeScreen;

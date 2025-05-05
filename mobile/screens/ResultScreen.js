import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ResultCard from '../components/ResultCard';

const ResultScreen = ({ route, navigation }) => {
  const { result } = route.params || {};

  if (!result) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>No result data available</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { prediction, confidence, image_url, gradcam_url } = result;
  const isCancer = prediction === 'Cancer';
  const confidencePercent = (confidence * 100).toFixed(2);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Result</Text>
        <Text style={styles.timestamp}>{new Date().toLocaleString()}</Text>
      </View>

      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Text style={[
            styles.resultText,
            isCancer ? styles.cancerText : styles.nonCancerText
          ]}>
            {prediction}
          </Text>
          <Text style={styles.confidenceText}>
            Confidence: {confidencePercent}%
          </Text>
        </View>

        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Text style={styles.imageLabel}>Original Image</Text>
            <Image
              source={{ uri: image_url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.imageWrapper}>
            <Text style={styles.imageLabel}>Heatmap (Grad-CAM)</Text>
            <Image
              source={{ uri: gradcam_url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ResultCard 
        prediction={prediction}
        confidence={confidence}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Take Another Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View History</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timestamp: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
  },
  resultContainer: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    margin: 15,
    padding: 20,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cancerText: {
    color: '#e74c3c',
  },
  nonCancerText: {
    color: '#2ecc71',
  },
  confidenceText: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  imagesContainer: {
    flexDirection: 'column',
  },
  imageWrapper: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    backgroundColor: '#2c3e50',
  },
  actionsContainer: {
    padding: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#7f8c8d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default ResultScreen;

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResultCard = ({ prediction, confidence }) => {
  const isCancer = prediction === 'Cancer';
  const confidencePercent = (confidence * 100).toFixed(2);
  
  const renderInfo = () => {
    if (isCancer) {
      return {
        icon: 'warning',
        iconColor: '#e74c3c',
        title: 'Cancer Detected',
        message: 'Cancer indicators have been detected in the image. Please consult with a healthcare professional for further evaluation.',
        recommendations: [
          'Consult with a specialist as soon as possible',
          'Schedule additional tests for confirmation',
          'Share these results with your healthcare provider'
        ]
      };
    } else {
      return {
        icon: 'checkmark-circle',
        iconColor: '#2ecc71',
        title: 'No Cancer Detected',
        message: 'No cancer indicators have been detected in the image. However, regular check-ups are still recommended.',
        recommendations: [
          'Continue regular check-ups and screenings',
          'Maintain a healthy lifestyle',
          'Contact your doctor if you notice any changes'
        ]
      };
    }
  };
  
  const info = renderInfo();
  
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={info.icon} size={30} color={info.iconColor} />
        <Text style={styles.cardTitle}>{info.title}</Text>
      </View>
      
      <Text style={styles.message}>{info.message}</Text>
      
      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceLabel}>Confidence:</Text>
        <View style={styles.confidenceBarContainer}>
          <View 
            style={[
              styles.confidenceBar,
              { width: `${confidencePercent}%`, backgroundColor: isCancer ? '#e74c3c' : '#2ecc71' }
            ]} 
          />
        </View>
        <Text style={styles.confidenceValue}>{confidencePercent}%</Text>
      </View>
      
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>Recommendations:</Text>
        {info.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons name="checkmark" size={16} color={info.iconColor} />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.disclaimer}>
        Note: This analysis is meant as a screening tool and not a definitive diagnosis. 
        Always consult with healthcare professionals for proper medical advice.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    margin: 15,
    padding: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  message: {
    fontSize: 14,
    color: '#ecf0f1',
    lineHeight: 20,
    marginBottom: 20,
  },
  confidenceContainer: {
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#bdc3c7',
    marginBottom: 5,
  },
  confidenceBarContainer: {
    height: 10,
    backgroundColor: '#2c3e50',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  confidenceBar: {
    height: '100%',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#ecf0f1',
    textAlign: 'right',
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    color: '#ecf0f1',
    marginLeft: 10,
  },
  disclaimer: {
    fontSize: 12,
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
});

export default ResultCard;

import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../utils/api';
import { AuthContext } from '../utils/auth';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authState } = useContext(AuthContext);

  const fetchHistory = async () => {
    try {
      const data = await api.getHistory(authState.token);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.created_at).toLocaleDateString();
    const time = new Date(item.created_at).toLocaleTimeString();
    const isCancer = item.prediction === 'Cancer';
    
    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => navigation.navigate('Result', { result: item })}
      >
        <View style={styles.historyContent}>
          <View style={styles.historyImageContainer}>
            <Image
              source={{ uri: item.image_url }}
              style={styles.historyImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.historyDetails}>
            <View style={styles.predictionRow}>
              <Text style={[
                styles.predictionText,
                isCancer ? styles.cancerText : styles.nonCancerText
              ]}>
                {item.prediction}
              </Text>
              <Text style={styles.confidenceText}>
                {(item.confidence * 100).toFixed(2)}%
              </Text>
            </View>
            
            <View style={styles.dateTimeRow}>
              <Text style={styles.dateText}>{date}</Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
          
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={60} color="#7f8c8d" />
            <Text style={styles.emptyText}>No history records found</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Text style={styles.emptyButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  historyItem: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  historyContent: {
    flexDirection: 'row',
    padding: 15,
  },
  historyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#2c3e50',
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
  historyDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancerText: {
    color: '#e74c3c',
  },
  nonCancerText: {
    color: '#2ecc71',
  },
  confidenceText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#bdc3c7',
    marginRight: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#ecf0f1',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;

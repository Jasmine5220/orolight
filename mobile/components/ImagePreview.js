import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImagePreview = ({ imageUri, onRetake, onUpload, uploading }) => {
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Image Preview</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.button}
              onPress={onRetake}
              disabled={uploading}
            >
              <Ionicons name="reload" size={22} color="#fff" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={onUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={22} color="#fff" />
                  <Text style={styles.buttonText}>Upload & Analyze</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  preview: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 73, 94, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default ImagePreview;

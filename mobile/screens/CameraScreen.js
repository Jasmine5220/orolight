import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as api from '../utils/api';
import { AuthContext } from '../utils/auth';
import CameraComponent from '../components/CameraComponent';
import ImagePreview from '../components/ImagePreview';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      // Request gallery permissions
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need gallery permissions to make this work!');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const uploadImage = async () => {
    if (!capturedImage) return;

    setUploading(true);
    
    try {
      const response = await api.uploadImage(capturedImage, authState.token);
      
      // Navigate to result screen with the data
      navigation.navigate('Result', { result: response });
      
      // Clear the captured image
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Failed to upload and analyze the image');
    } finally {
      setUploading(false);
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
  };

  if (hasPermission === null) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#3498db" /></View>;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={pickImage}
        >
          <Text style={styles.permissionButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <ImagePreview 
        imageUri={capturedImage}
        onRetake={resetCamera}
        onUpload={uploadImage}
        uploading={uploading}
      />
    );
  }

  return (
    <CameraComponent 
      cameraRef={cameraRef}
      type={type}
      onToggleType={() => {
        setType(
          type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
      }}
      onCapture={takePicture}
      onPickImage={pickImage}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;

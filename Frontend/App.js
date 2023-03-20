import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);

  let camera = null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleRecord = async () => {
    if (isRecording) {
      await camera.stopRecording();
      setIsRecording(false);
      const video = await camera.recordedVideo;
      const asset = await MediaLibrary.createAssetAsync(video.uri);
      const formData = new FormData();
      formData.append('video', {
        uri: asset.uri,
        name: 'video.mp4',
        type: 'video/mp4',
      });
      const response = await axios.post('http://localhost:3000/upload', formData);
      console.log(response.data);
    } else {
      const { uri } = await camera.recordAsync({ quality: '1080p' });
      setIsRecording(true);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={(ref) => (camera = ref)}
        style={{ flex: 1 }}
        type={cameraType}
      />
      <Button title="Switch Camera" onPress={handleCameraType} />
      <Button
        title={isRecording ? 'Stop Recording' : 'Record'}
        onPress={handleRecord}
      />
    </View>
  );
}
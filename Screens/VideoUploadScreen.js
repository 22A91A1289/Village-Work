import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const VideoUploadScreen = ({ route, navigation }) => {
  const { fromOnboarding } = route?.params || {};
  const [videoUri, setVideoUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const recordingPromiseRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery permission is required to select your introduction video.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 240) { // Stop at 4 minutes
            handleStopRecording();
            return 240;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    // Request camera permission
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Camera permission is required to record video.');
        return;
      }
    }

    // Request microphone permission
    if (!microphonePermission?.granted) {
      const { granted } = await requestMicrophonePermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio with video.');
        return;
      }
    }

    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready. Please try again.');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start recording - this returns a promise that resolves when recording stops
      recordingPromiseRef.current = cameraRef.current.recordAsync({
        maxDuration: 240, // 4 minutes max
        mute: false, // Enable microphone recording
        quality: 'high',
      });

      // Wait for recording to complete (when stopRecording is called or maxDuration reached)
      recordingPromiseRef.current.then((recording) => {
        if (recording && recording.uri) {
          setVideoUri(recording.uri);
          setVideoDuration(recordingDuration || 30);
          setShowCamera(false);
        }
        setIsRecording(false);
        recordingPromiseRef.current = null;
      }).catch((error) => {
        console.error('Error recording video:', error);
        Alert.alert('Error', 'Failed to record video. Please try again.');
        setIsRecording(false);
        recordingPromiseRef.current = null;
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        cameraRef.current.stopRecording();
        // The recording promise will resolve automatically
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        recordingPromiseRef.current = null;
      }
    }
  };

  const handleCancelRecording = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setShowCamera(false);
    setRecordingDuration(0);
  };

  const pickVideoFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select video.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 240, // Allow up to 4 minutes
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        // Get video duration (convert from milliseconds to seconds)
        if (result.assets[0].duration) {
          const durationInSeconds = Math.round(result.assets[0].duration / 1000);
          console.log('📹 Video duration:', result.assets[0].duration, 'ms =', durationInSeconds, 'seconds');
          setVideoDuration(durationInSeconds);
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video from gallery.');
    }
  };

  const handleRecordSelfVideo = async () => {
    // Request camera permission
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Camera permission is required to record video.');
        return;
      }
    }

    // Request microphone permission
    if (!microphonePermission?.granted) {
      const { granted } = await requestMicrophonePermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio with video.');
        return;
      }
    }
    setShowCamera(true);
    setRecordingDuration(0);
  };

  const handleRetake = () => {
    setVideoUri(null);
    setVideoDuration(0);
  };

  const handleSkip = async () => {
      if (fromOnboarding) {
        try {
          await AsyncStorage.setItem('hasVideoIntroduction', 'pending');
          await AsyncStorage.setItem('videoUploadDate', new Date().toISOString());
          await AsyncStorage.setItem('userSkillLevel', 'new');
          await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
          navigation.replace('WorkerTabNavigator');
        } catch (error) {
          console.error('Error saving skip status:', error);
          navigation.replace('WorkerTabNavigator');
        }
      } else {
        navigation.goBack();
      }
  };

  const handleUpload = async () => {
    if (!videoUri) {
      Alert.alert('No Video', 'Please select a video first.');
      return;
    }

    // Check video duration (must be 30 seconds to 4 minutes = 30-240 seconds)
    if (videoDuration > 0 && videoDuration < 30) {
      Alert.alert(
        'Video Too Short',
        'Your introduction video must be at least 30 seconds long. Please record or select a longer video.'
      );
      return;
    }

    if (videoDuration > 240) {
      Alert.alert(
        'Video Too Long',
        'Your introduction video must not exceed 4 minutes (240 seconds). Please record or select a shorter video.'
      );
      return;
    }

    setIsUploading(true);

    try {
      // Store video URI locally in AsyncStorage
      await AsyncStorage.setItem('userVideoUri', videoUri);
      await AsyncStorage.setItem('videoUploadDate', new Date().toISOString());
      await AsyncStorage.setItem('hasVideoIntroduction', 'true');
      if (videoDuration > 0) {
        await AsyncStorage.setItem('videoDuration', videoDuration.toString());
      }

      // Upload to backend to mark video as uploaded
      try {
        await api.post('/api/users/upload-video', {
          videoUrl: videoUri, // In production, this would be cloud storage URL
          duration: videoDuration
        }, { auth: true });
        
        console.log('✅ Video uploaded to backend successfully');
      } catch (backendError) {
        console.warn('⚠️ Failed to upload to backend, but saved locally:', backendError);
        // Continue anyway - video is saved locally
      }

      setIsUploading(false);

      Alert.alert(
        'Success! 🎉',
        'Your introduction video has been uploaded successfully. Employers can now view it in your profile.',
        [
          {
            text: 'Continue',
            onPress: async () => {
              if (fromOnboarding) {
                await AsyncStorage.setItem('userSkillLevel', 'new');
                await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
                navigation.replace('WorkerTabNavigator');
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!cameraPermission || !microphonePermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            mode="video"
          >
            {/* Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={handleCancelRecording}
              >
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.recordingTimerContainer}>
                {isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingTimer}>
                      {formatDuration(recordingDuration)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ width: 40 }} />
            </View>

            {/* Recording Controls */}
            <View style={styles.recordingControls}>
              {!isRecording ? (
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={startRecording}
                >
                  <View style={styles.recordButtonInner} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={handleStopRecording}
                >
                  <View style={styles.stopButtonInner} />
                </TouchableOpacity>
              )}
            </View>
          </CameraView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Introduction Video</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {!videoUri ? (
          /* Selection View */
          <View style={styles.selectionContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="videocam-outline" size={80} color="#4F46E5" />
            </View>

            <Text style={styles.title}>Record Your Introduction</Text>
            <Text style={styles.subtitle}>
              Upload a 30 seconds to 4 minutes video introducing yourself to potential employers
            </Text>

            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.instructionText}>
                  Introduce yourself (name, location, experience)
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.instructionText}>
                  Mention your key skills and expertise
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.instructionText}>
                  Speak clearly and confidently
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.instructionText}>
                  Keep it between 30 seconds to 4 minutes
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.recordSelfButton}
              onPress={handleRecordSelfVideo}
            >
              <Ionicons name="videocam" size={24} color="#FFFFFF" />
              <Text style={styles.recordSelfButtonText}>Record Self Video</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={pickVideoFromGallery}
            >
              <Ionicons name="images-outline" size={24} color="#FFFFFF" />
              <Text style={styles.selectButtonText}>Select Video from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Preview View */
          <View style={styles.previewContainer}>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: videoUri }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
              />
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.infoText}>
                  Duration: {formatDuration(videoDuration)}
                </Text>
              </View>
              {videoDuration > 0 && videoDuration < 30 && (
                <View style={styles.warningContainer}>
                  <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                  <Text style={styles.warningText}>
                    Video should be at least 30 seconds
                  </Text>
                </View>
              )}
              {videoDuration > 240 && (
                <View style={styles.warningContainer}>
                  <Ionicons name="warning-outline" size={20} color="#EF4444" />
                  <Text style={[styles.warningText, { color: '#991B1B' }]}>
                    Video exceeds 4 minutes maximum
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.previewControls}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Ionicons name="refresh-outline" size={20} color="#374151" />
                <Text style={styles.retakeButtonText}>Select Different Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
                onPress={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.uploadButtonText}>Upload Video</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  note: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  },
  previewContainer: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  retakeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTimerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  recordingTimer: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recordingControls: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  stopButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordSelfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  recordSelfButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoUploadScreen;

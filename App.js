import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConfirmModalProvider } from './contexts/ConfirmModalContext';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ConfirmModalProvider>
          <View style={styles.root}>
            <AppNavigator />
          </View>
        </ConfirmModalProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' && { minHeight: '100vh' }),
  },
});

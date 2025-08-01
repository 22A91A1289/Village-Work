import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const WorkerKYCVerification = ({ navigation }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKYCVerification = async () => {
    if (!aadhaarNumber.trim() || !mobileNumber.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (aadhaarNumber.length !== 12) {
      Alert.alert("Error", "Please enter a valid 12-digit Aadhaar number");
      return;
    }
    if (mobileNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    // Simulate KYC verification (replace with actual API in real app)
    setTimeout(async () => {
      setIsLoading(false);
      try {
        await AsyncStorage.setItem("kycVerified", "true");
        await AsyncStorage.setItem("aadhaarNumber", aadhaarNumber);
        await AsyncStorage.setItem("mobileNumber", mobileNumber);
        Alert.alert(
          "KYC Verification Successful",
          "Your details have been verified. You can now proceed to login.",
          [
            {
              text: "Continue",
              onPress: () => navigation.navigate("LoginScreen"),
            },
          ]
        );
      } catch (error) {
        Alert.alert("Error", "Failed to save verification data");
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="person-circle-outline" size={48} color="#10B981" />
            </View>
            <Text style={styles.title}>KYC Verification</Text>
            <Text style={styles.subtitle}>Verify your identity to access work opportunities</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aadhaar Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your 12-digit Aadhaar number"
                maxLength={12}
                keyboardType="number-pad"
                value={aadhaarNumber}
                onChangeText={setAadhaarNumber}
                editable={!isLoading}
              />
            </View>
            <Text style={styles.inputHint}>Enter your 12-digit Aadhaar number without spaces</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your 10-digit mobile number"
                maxLength={10}
                keyboardType="number-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                editable={!isLoading}
              />
            </View>
            <Text style={styles.inputHint}>Enter your 10-digit mobile number</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="lock-closed-outline" size={18} color="#1E40AF" />
              <Text style={styles.infoText}>Your data is encrypted and secure</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#1E40AF" />
              <Text style={styles.infoText}>Verification is required for work opportunities</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (isLoading || !aadhaarNumber || !mobileNumber) && styles.verifyButtonDisabled,
            ]}
            onPress={handleKYCVerification}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#fff" style={styles.spinning} />
                <Text style={styles.verifyButtonText}>Verifying...</Text>
              </>
            ) : (
              <Text style={styles.verifyButtonText}>Verify KYC</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: { alignItems: "center", paddingTop: 40, paddingBottom: 30 },
  logoContainer: { alignItems: "center" },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24 },
  formContainer: { paddingHorizontal: 20, marginBottom: 20 },
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  textInput: { flex: 1, fontSize: 16, color: "#1F2937", marginLeft: 12 },
  inputHint: { fontSize: 12, color: "#6B7280", marginTop: 6, marginLeft: 4 },
  infoContainer: { backgroundColor: "#F0F9FF", padding: 16, borderRadius: 12, marginBottom: 24 },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { fontSize: 14, color: "#1E40AF", marginLeft: 8, flex: 1 },
  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  verifyButtonDisabled: { backgroundColor: "#9CA3AF" },
  spinning: { marginRight: 8 },
  verifyButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginLeft: 8 },
  footer: { paddingHorizontal: 20 },
  footerText: { fontSize: 12, color: "#9CA3AF", textAlign: "center", lineHeight: 18 }
});

export default WorkerKYCVerification;

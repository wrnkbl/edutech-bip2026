import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppState } from './_shared/appstate/store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const authenticate = useAppState((s: any) => s.authenticate);
  const fetchAllData = useAppState((s: any) => s.fetchAllData);

  const handleSignIn = async () => {
    setError(null);

    const validUsers = [
      "jan.kowalski@university.edu",
      "anna.nowak@university.edu",
      "piotr.grabowski@university.edu"
    ];

    if (!validUsers.includes(email.toLowerCase())) {
      setError("Invalid email or user not found");
      return;
    }

   const ok = await authenticate(email, password); 
  
  if (ok) {
    await fetchAllData(); 
  } else {
    setError("Invalid password. Please try again.");
  }
  };

  return (
    <LinearGradient colors={['#93B5C6', '#F2E6B6']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.inner}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/Logo Mokademy 1.png')} 
              style={styles.cupIcon}
              resizeMode="contain" 
            />
            <Image 
              source={require('../assets/images/Logo Mokademy txt 1 (1).png')} 
              style={styles.brandImage} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.loginCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} color="#4E342E" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your email here..."
                  placeholderTextColor="#8D8471"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color="#4E342E" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#8D8471"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  cupIcon: { width: 180, height: 180, marginBottom: 0 },
  brandImage: { width: 250, height: 80, marginTop: -10 },
  loginCard: {
    backgroundColor: '#4A2E22',
    width: '80%',
    borderRadius: 30,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 80
  },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: 'TitanOne', color: '#F2E6B6', fontSize: 14, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2E6B6',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 45,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontFamily: 'Capriola', fontSize: 12, color: '#4E342E' },
  errorText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontFamily: 'Capriola',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: -5
  },
  signInButton: {
    backgroundColor: '#93B5C6',
    height: 45,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  signInButtonText: { fontFamily: 'Capriola', color: '#F2E6B6', fontSize: 14 },
  forgotText: { color: '#93B5C6', textAlign: 'center', fontFamily: 'Capriola', fontSize: 12 }
});
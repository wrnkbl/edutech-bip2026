import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="My courses" 
        searchPlaceholder="courses..." 
      />
      
      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']} 
        style={styles.content}
      >
        <Text style={styles.placeholderText}>
          just a demo header+background
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E342E', 
  },
  content: {
    flex: 1,
    padding: 20,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#4E342E',
    fontFamily: 'Capriola',
    fontSize: 14,
    opacity: 0.7,
  }
});
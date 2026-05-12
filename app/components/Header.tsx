import { Capriola_400Regular } from '@expo-google-fonts/capriola';
import { TitanOne_400Regular, useFonts } from '@expo-google-fonts/titan-one';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';


interface HeaderProps {
  title: string;     
  searchPlaceholder: string; 
}

export default function Header({ title, searchPlaceholder }: HeaderProps) {
  let [fontsLoaded] = useFonts({
    'TitanOne': TitanOne_400Regular,
    'Capriola': Capriola_400Regular,
  });
  if (!fontsLoaded) return null;
  return (
    <View style={styles.headerBackground}>
      <View style={styles.contentContainer}>
        
        <View style={styles.topRow}>
          <Text style={styles.titleText}>{title}</Text>
          
          <View style={styles.pointsBadge}>
            <Ionicons name="ribbon" size={16} color="#4E342E" />
            <Text style={styles.pointsText}>500</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#4E342E" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder={`Search ${searchPlaceholder}`}
            placeholderTextColor="#8D8471"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#4E342E',
    width: '100%',
    height: 170,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleText: {
    fontFamily: 'TitanOne',
    fontSize: 24,
    color: '#93B5C6',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C5B499',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsText: {
    color: '#FFF',
    fontFamily: 'Capriola',
    fontSize: 14,
    marginLeft: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1E3B2',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Capriola',
    fontSize: 12,
    color: '#4E342E',
  },
});
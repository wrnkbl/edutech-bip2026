import { Capriola_400Regular } from '@expo-google-fonts/capriola';
import { TitanOne_400Regular, useFonts } from '@expo-google-fonts/titan-one';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppState } from '../_shared/appstate/store';
import Header from '../components/Header';

export default function ProfileScreen() {
  const user = useAppState((s: any) => s.user);
  const isLoading = useAppState((s: any) => s.isLoading);
  const isInitialized = useAppState((s: any) => s.isInitialized);
  const clearAppState = useAppState((s: any) => s.clear);
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    'TitanOne': TitanOne_400Regular,
    'Capriola': Capriola_400Regular,
  });

  const isReady = fontsLoaded && !isLoading && isInitialized;

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4E342E" />
      </View>
    );
  }

  const handleSignOut = () => {
   
    clearAppState();
   
    router.replace('/login');
  };

  
  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest User';
  const displayEmail = user?.email || 'no-email@university.edu';

  return (
    <View style={styles.mainContainer}>
    
      <Header title="Profile" searchPlaceholder="settings..." />
      
      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
        
        <View style={styles.userCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={36} color="#93B5C6" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmailText}>{displayEmail}</Text>
          </View>
        </View>

      
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="mail" size={20} color="#4A2E22" style={styles.menuIcon} />
              <View>
                <Text style={styles.menuItemLabel}>Email</Text>
                <Text style={styles.menuItemSubLabel}>{displayEmail}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#4A2E22" />
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed" size={20} color="#4A2E22" style={styles.menuIcon} />
              <Text style={styles.menuItemLabelOnly}>Change password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#4A2E22" />
          </TouchableOpacity>
        </View>

        
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications" size={20} color="#4A2E22" style={styles.menuIcon} />
              <Text style={styles.menuItemLabelOnly}>Notification</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuValueText}>Enabled</Text>
              <Ionicons name="chevron-forward" size={18} color="#4A2E22" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe" size={20} color="#4A2E22" style={styles.menuIcon} />
              <Text style={styles.menuItemLabelOnly}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuValueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#4A2E22" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Przycisk wylogowania */}
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#4E342E',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E342E',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#93b5c6cc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userName: {
    color: '#4a2e22',
    fontFamily: 'TitanOne',
    fontSize: 20,
    marginBottom: 2,
  },
  userEmailText: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 13,
    opacity: 0.8,
  },
  sectionTitle: {
    color: '#4A2E22',
    fontFamily: 'TitanOne',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.6,
  },
  menuGroup: {
    backgroundColor: '#f2e6b6cc',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 14,
    width: 20,
    textAlign: 'center',
  },
  menuItemLabel: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 14,
    fontWeight: '700',
  },
  menuItemSubLabel: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 11,
    opacity: 0.6,
    marginTop: 1,
  },
  menuItemLabelOnly: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 14,
    fontWeight: '700',
  },
  menuValueText: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 12,
    opacity: 0.6,
    marginRight: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#4A2E22',
    opacity: 0.1,
  },
  signOutButton: {
    backgroundColor: '#4E342E',
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  signOutButtonText: {
    fontFamily: 'TitanOne',
    color: '#F2E6B6',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
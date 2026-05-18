import { Capriola_400Regular } from '@expo-google-fonts/capriola';
import { TitanOne_400Regular, useFonts } from '@expo-google-fonts/titan-one';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppState } from '../_shared/appstate/store';
import Header from '../components/Header';

export default function StockScreen() {
  const store = useAppState((s: any) => s.store);
  const claimItem = useAppState((s: any) => s.claimItem);
  const userPoints = useAppState((s: any) => s.userPoints);
  const isLoading = useAppState((s: any) => s.isLoading);
  const isInitialized = useAppState((s: any) => s.isInitialized);
  
  const [purchasingUuid, setPurchasingUuid] = useState<string | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  
  // Stan przechowujący aktualny czas do odliczania
  const [now, setNow] = useState<number>(Date.now());

  // Efekt aktualizujący czas co sekundę (potrzebny do płynnego odliczania)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const allItems = store?.vendors?.flatMap((vendor: any) => vendor.items) || [];
  const claimedRecords: any[] = store?.claimedItems ? Object.values(store.claimedItems) : [];
  const claimedItemUuuids = claimedRecords.map((record: any) => record.itemUuid);

  const availableItems = allItems.filter((item: any) => {
    if (!item.reclaimable && claimedItemUuuids.includes(item.uuid)) {
      return false;
    }
    return true;
  });

  const usedItems = allItems.filter((item: any) => claimedItemUuuids.includes(item.uuid));

 
  const getCooldownTimeLeft = (item: any) => {
    if (!item.reclaimable || item.reclaimCooldown <= 0) return 0;


    const itemClaims = claimedRecords.filter((r: any) => r.itemUuid === item.uuid);
    if (itemClaims.length === 0) return 0;

   
    const timestamps = itemClaims.map((r: any) => new Date(r.timestamp).getTime());
    const lastClaimTime = Math.max(...timestamps);

    const timePassedMs = now - lastClaimTime;
    const cooldownMs = item.reclaimCooldown * 1000;

    if (timePassedMs < cooldownMs) {
      return Math.ceil((cooldownMs - timePassedMs) / 1000);
    }
    return 0;
  };

  const handleUseItem = async (itemUuid: string, pointsCost: number, cooldownLeft: number) => {
    if (cooldownLeft > 0) {
      Alert.alert("Cooldown", `Please wait ${cooldownLeft}s before claiming this item again.`);
      return;
    }

    if (userPoints < pointsCost) {
      Alert.alert("Error", "You don't have enough points to claim this item!");
      return;
    }

    try {
      setPurchasingUuid(itemUuid);
      await claimItem(itemUuid);
      setQrModalVisible(true);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to claim the item.");
    } finally {
      setPurchasingUuid(null);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header title="Stock" searchPlaceholder="items..." />
      
      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {availableItems.map((item: any) => {
            const cooldownLeft = getCooldownTimeLeft(item);
            const isInCooldown = cooldownLeft > 0;

            return (
              <View key={item.uuid} style={[styles.card, isInCooldown && styles.cooldownCard]}>
                <View style={styles.logoContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={[styles.itemImage, isInCooldown && styles.cooldownImage]} resizeMode="contain" />
                  ) : (
                    <Ionicons name="gift" size={32} color="#4A2E22" />
                  )}
                </View>
                
                <View style={styles.detailsContainer}>
                  <Text style={[styles.itemTitle, isInCooldown && styles.cooldownText]}>{item.name}</Text>
                  <Text style={[styles.itemDescription, isInCooldown && styles.cooldownText]}>{item.description}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, isInCooldown && styles.cooldownText]}>Price: </Text>
                    <Text style={[styles.priceValue, isInCooldown && styles.cooldownText]}>{item.pointsCost} </Text>
                    <Ionicons name="ribbon" size={14} color={isInCooldown ? "rgba(74, 46, 34, 0.4)" : "#93B5C6"} />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.useButton, isInCooldown && styles.cooldownButton]}
                  onPress={() => handleUseItem(item.uuid, item.pointsCost, cooldownLeft)}
                  disabled={purchasingUuid !== null}
                >
                  {purchasingUuid === item.uuid ? (
                    <ActivityIndicator size="small" color="#F2E6B6" />
                  ) : isInCooldown ? (
                    <Text style={styles.useButtonText}>{cooldownLeft}s</Text>
                  ) : (
                    <Text style={styles.useButtonText}>Use</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}

          {usedItems.length > 0 && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>USED</Text>
                <View style={styles.dividerLine} />
              </View>

              {usedItems.map((item: any, index: number) => (
                <View key={`used-${item.uuid}-${index}`} style={[styles.card, styles.usedCard]}>
                  <View style={[styles.logoContainer, styles.usedLogoContainer]}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={[styles.itemImage, styles.usedImage]} resizeMode="contain" />
                    ) : (
                      <Ionicons name="gift" size={32} color="#4A2E22" />
                    )}
                  </View>
                  
                  <View style={styles.detailsContainer}>
                    <Text style={[styles.itemTitle, styles.usedText]}>{item.name}</Text>
                    <Text style={[styles.itemDescription, styles.usedText]}>{item.description}</Text>
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceLabel, styles.usedText]}>Price: </Text>
                      <Text style={[styles.priceValue, styles.usedText]}>{item.pointsCost} </Text>
                      <Ionicons name="ribbon" size={14} color="rgba(74, 46, 34, 0.4)" />
                    </View>
                  </View>

                  <View style={[styles.useButton, styles.usedButton]}>
                    <Text style={styles.useButtonText}>Use</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </LinearGradient>

      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupBox}>
            <Image 
              source={require('../../assets/images/qr.png')} 
              style={styles.qrCodeImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setQrModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#f2e6b6" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 24,
    alignItems: 'stretch',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E342E',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2e6b6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    width: '100%',
  },
  usedCard: {
    opacity: 0.6,
  },
  cooldownCard: {
    opacity: 0.7,
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  usedLogoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  usedImage: {
    opacity: 0.4,
  },
  cooldownImage: {
    opacity: 0.3,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    color: '#4a2e22',
    fontFamily: 'TitanOne',
    fontSize: 18,
    marginBottom: 4,
  },
  itemDescription: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 12,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#4A2E22',
    fontFamily: 'Capriola',
    fontSize: 12,
  },
  priceValue: {
    color: '#93B5C6',
    fontFamily: 'Capriola',
    fontSize: 12,
    fontWeight: '700',
  },
  useButton: {
    backgroundColor: '#93b5c6',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  usedButton: {
    backgroundColor: '#A8BDC7',
    opacity: 0.5,
  },
  cooldownButton: {
    backgroundColor: '#A8BDC7',
  },
  useButtonText: {
    fontFamily: 'TitanOne',
    color: '#f2e6b6',
    fontSize: 13,
  },
  usedText: {
    color: 'rgba(74, 46, 34, 0.6)',
  },
  cooldownText: {
    color: 'rgba(74, 46, 34, 0.5)',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f2e6b6',
    opacity: 1,
  },
  dividerText: {
    fontFamily: 'TitanOne',
    color: '#f2e6b6',
    fontSize: 14,
    paddingHorizontal: 10,
    letterSpacing: 1,
    opacity: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: 280,
    height: 280,
    backgroundColor: '#93B5C6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    bottom: -60,
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#4A2E22',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
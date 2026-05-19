import { Capriola_400Regular } from '@expo-google-fonts/capriola';
import { TitanOne_400Regular, useFonts } from '@expo-google-fonts/titan-one';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppState } from '../_shared/appstate/store';
import Header from '../components/Header';

export default function MarketScreen() {
  const {
    store,
    buyItem,
    userPoints,
    isLoading,
    isInitialized,
    init,
    fetchAllData
  } = useAppState();
  
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [purchasingUuid, setPurchasingUuid] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      init();
    } else {
      fetchAllData();
    }
  }, [isInitialized]);

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

  const marketItems = store?.vendors?.flatMap((vendor: any) => vendor.items) || [];

  const handlePurchasePress = (item: any) => {
    setSelectedItem(item);
    setConfirmModalVisible(true);
  };

   const handleConfirmPurchase = async () => {
     if (!selectedItem) return;

     if (userPoints < selectedItem.pointsCost) {
       setConfirmModalVisible(false);
       Alert.alert("Insufficient Points", "You don't have enough points to purchase this item.");
       return;
     }

     try {
       setConfirmModalVisible(false);
       setPurchasingUuid(selectedItem.uuid);
       await buyItem(selectedItem.uuid);
       Alert.alert("Success", `You successfully purchased ${selectedItem.name}!`);
     } catch (error: any) {
       Alert.alert("Purchase Failed", error?.message || "Something went wrong.");
     } finally {
       setPurchasingUuid(null);
       setSelectedItem(null);
     }
   };

  return (
    <View style={styles.mainContainer}>
      <Header title="Market" searchPlaceholder="items..." />
      
      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.listContainer} 
          showsVerticalScrollIndicator={false}
        >
          {marketItems.map((item: any) => (
            <View key={item.uuid} style={styles.card}>
              
              <View style={styles.logoContainer}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                ) : (
                  <Ionicons name="film" size={32} color="#4A2E22" />
                )}
              </View>
              
              <View style={styles.detailsContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Price: </Text>
                  <Text style={styles.priceValue}>{item.pointsCost} </Text>
                  <Ionicons name="ribbon" size={14} color="#93B5C6" />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.purchaseButton}
                onPress={() => handlePurchasePress(item)}
                disabled={purchasingUuid === item.uuid}
              >
                {purchasingUuid === item.uuid ? (
                  <ActivityIndicator size="small" color="#F2E6B6" />
                ) : (
                  <Text style={styles.purchaseButtonText}>Purchase</Text>
                )}
              </TouchableOpacity>

            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Confirmation Box overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupText}>
              Are you sure you want to buy this?
            </Text>

            <View style={styles.actionRow}>
              {/* Confirm YES Button Container */}
              <TouchableOpacity 
                style={styles.squareActionButton} 
                onPress={handleConfirmPurchase}
              >
                <Ionicons name="checkmark-sharp" size={38} color="#F2E6B6" style={styles.thickIcon} />
                <Text style={styles.actionButtonText}>Yes</Text>
              </TouchableOpacity>

              {/* Cancel NO Button Container */}
              <TouchableOpacity 
                style={styles.squareActionButton} 
                onPress={() => {
                  setConfirmModalVisible(false);
                  setSelectedItem(null);
                }}
              >
                <Ionicons name="close-sharp" size={38} color="#F2E6B6" style={styles.thickIcon} />
                <Text style={styles.actionButtonText}>No</Text>
              </TouchableOpacity>
            </View>
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
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  itemImage: {
    width: '100%',
    height: '100%',
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
  purchaseButton: {
    backgroundColor: '#93b5c6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  purchaseButtonText: {
    fontFamily: 'TitanOne',
    color: '#f2e6b6',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: 320,
    backgroundColor: '#93B5C6',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popupText: {
    fontFamily: 'TitanOne',
    color: '#F2E6B6',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  squareActionButton: {
    backgroundColor: '#4A2E22',
    width: 115,
    height: 115,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    paddingBottom: 6,
  },
  thickIcon: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionButtonText: {
    fontFamily: 'TitanOne',
    color: '#F2E6B6',
    fontSize: 18,
    lineHeight: 22,
    marginTop: 2,
  },
});
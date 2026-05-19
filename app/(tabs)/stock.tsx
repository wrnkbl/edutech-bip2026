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
  const getBoughtItems = useAppState((s: any) => s.getBoughtItems);
  const getClaimedItems = useAppState((s: any) => s.getClaimedItems);
  const isLoading = useAppState((s: any) => s.isLoading);
  const isInitialized = useAppState((s: any) => s.isInitialized);
  
  const [claimingUuid, setClaimingUuid] = useState<string | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

   const boughtItems = getBoughtItems().filter((entry: any) => {
     const matchesSearch = 
       entry.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.item.description.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesSearch;
   });

   const claimedItems = getClaimedItems().filter((entry: any) => {
     const matchesSearch = 
       entry.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.item.description.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesSearch;
   });

   const handleClaimItem = async (itemUuid: string) => {
     try {
       setClaimingUuid(itemUuid);
       await claimItem(itemUuid);
       setQrModalVisible(true);
     } catch (error: any) {
       Alert.alert("Error", error?.message || "Failed to claim the item.");
     } finally {
       setClaimingUuid(null);
     }
   };

  return (
    <View style={styles.mainContainer}>
      <Header 
        title="Stock" 
        searchPlaceholder="items..." 
        onSearchChange={(text) => setSearchQuery(text)} 
      />
      
      <LinearGradient
        colors={['#93B5C6', '#F2E6B6']}
        style={styles.content}
      >
         <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
           {boughtItems.length === 0 && claimedItems.length === 0 ? (
             <Text style={styles.emptyText}>No items to show</Text>
           ) : (
             <>
               {boughtItems.length > 0 && (
                 <>
                   <View style={styles.sectionHeader}>
                     <Text style={styles.sectionTitle}>PURCHASED</Text>
                   </View>
                   {boughtItems.map((entry: any) => (
                     <View key={entry.buyUuid} style={styles.card}>
                       <View style={styles.logoContainer}>
                         {entry.item.image ? (
                           <Image source={{ uri: entry.item.image }} style={styles.itemImage} resizeMode="contain" />
                         ) : (
                           <Ionicons name="gift" size={32} color="#4A2E22" />
                         )}
                       </View>
                       
                       <View style={styles.detailsContainer}>
                         <Text style={styles.itemTitle}>{entry.item.name}</Text>
                         <Text style={styles.itemDescription}>{entry.item.description}</Text>
                         <View style={styles.priceRow}>
                           <Text style={styles.priceLabel}>Price: </Text>
                           <Text style={styles.priceValue}>{entry.item.pointsCost} </Text>
                           <Ionicons name="ribbon" size={14} color="#93B5C6" />
                         </View>
                       </View>

                       <TouchableOpacity 
                         style={styles.useButton}
                         onPress={() => handleClaimItem(entry.item.uuid)}
                         disabled={claimingUuid !== null}
                       >
                         {claimingUuid === entry.item.uuid ? (
                           <ActivityIndicator size="small" color="#F2E6B6" />
                         ) : (
                           <Text style={styles.useButtonText}>Claim</Text>
                         )}
                       </TouchableOpacity>
                     </View>
                   ))}
                 </>
               )}

               {claimedItems.length > 0 && (
                 <>
                   <View style={styles.dividerRow}>
                     <View style={styles.dividerLine} />
                     <Text style={styles.dividerText}>CLAIMED</Text>
                     <View style={styles.dividerLine} />
                   </View>

                   {claimedItems.map((entry: any) => (
                     <View key={entry.claimUuid} style={[styles.card, styles.claimedCard]}>
                       <View style={[styles.logoContainer, styles.claimedLogoContainer]}>
                         {entry.item.image ? (
                           <Image source={{ uri: entry.item.image }} style={[styles.itemImage, styles.claimedImage]} resizeMode="contain" />
                         ) : (
                           <Ionicons name="gift" size={32} color="#4A2E22" />
                         )}
                       </View>
                       
                       <View style={styles.detailsContainer}>
                         <Text style={[styles.itemTitle, styles.claimedText]}>{entry.item.name}</Text>
                         <Text style={[styles.itemDescription, styles.claimedText]}>{entry.item.description}</Text>
                         <View style={styles.priceRow}>
                           <Text style={[styles.priceLabel, styles.claimedText]}>Claimed at: </Text>
                           <Text style={[styles.priceValue, styles.claimedText]}>
                             {entry.claimedAt.toLocaleTimeString()}
                           </Text>
                         </View>
                       </View>

                       <View style={[styles.useButton, styles.claimedButton]}>
                         <Ionicons name="checkmark" size={20} color="#4A2E22" />
                       </View>
                     </View>
                   ))}
                 </>
               )}
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
   claimedCard: {
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
   claimedLogoContainer: {
     backgroundColor: 'rgba(255, 255, 255, 0.2)',
   },
   itemImage: {
     width: '100%',
     height: '100%',
   },
   usedImage: {
     opacity: 0.4,
   },
   claimedImage: {
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
   claimedButton: {
     backgroundColor: '#A8BDC7',
     opacity: 0.8,
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
   claimedText: {
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
   sectionHeader: {
     marginVertical: 16,
     alignItems: 'center',
   },
   sectionTitle: {
     fontFamily: 'TitanOne',
     color: '#f2e6b6',
     fontSize: 14,
     letterSpacing: 1,
   },
   emptyText: {
     fontFamily: 'Capriola',
     color: '#f2e6b6',
     fontSize: 16,
     textAlign: 'center',
     marginTop: 40,
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
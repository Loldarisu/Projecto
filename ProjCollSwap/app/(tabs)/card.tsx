import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

import asheImage from '../custom/imgs/game/digimon/char/image_1_normal.png';

const { width } = Dimensions.get('window');
const CARD_COUNT = 5;

export default function CardPage() {
  const router = useRouter();
  const [normal, setNormal] = useState(1);
  const [metallic, setMetallic] = useState(0);
  const [gold, setGold] = useState(0);
  const [polycrome, setPolycrome] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const rows = [
    { label: 'Number of normal cards', value: normal },
    { label: 'Number of metallic cards', value: metallic },
    { label: 'Number of gold cards', value: gold },
    { label: 'Number of polycrome cards', value: polycrome },
  ];

  return (
    <ScrollView contentContainerStyle={[styles.containerCenter, styles.backgroundPurple]}>      
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Avatar & Name */}
      <Image source={asheImage} style={local.avatar} />
      <Text style={local.name}>Ashe</Text>

      {/* Description Bubble */}
      <View style={local.bubble}>
        <Text style={local.bubbleText}>
          Ash is a fast, maneuverable Warframe that possesses a high degree of survivability in the field. Fleet movement complements deadly tools of assassination, making Ashe a perfect balance between killing potency and stealth.
        </Text>
      </View>

      {/* Card Attributes */}
      {rows.map((row, index) => (
        <View key={index} style={local.row}>
          <Text style={local.rowLabel}>{row.label}</Text>
          <Text style={local.rowCount}>{row.value}</Text>
          <Pressable onPress={() => setModalVisible(true)} style={local.rowIcon}>
            <Ionicons name="swap-horizontal" size={24} color="#fff" />
          </Pressable>
        </View>
      ))}

      {/* Info Bubble */}
      <View style={local.bubble}>
        <Text style={local.bubbleText}>
          Merging cards will combine them into a stronger version. The number of cards required is 5 for each rarity. This action is irreversible. Click ↔ to merge
        </Text>
      </View>

      {/* Merge Confirmation Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={local.modalOverlay}>
          <View style={local.modalContent}>
            <Text style={local.modalText}>You want to merge?</Text>
            <View style={local.modalButtons}>
              <TouchableOpacity style={[local.modalBtn, { backgroundColor: '#28a745' }]} onPress={() => setModalVisible(false)}>
                <Text style={local.modalBtnText}>Merge</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[local.modalBtn, { backgroundColor: '#dc3545' }]} onPress={() => setModalVisible(false)}>
                <Text style={local.modalBtnText}>Don’t merge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '700',
    marginBottom: 20,
  },
  bubble: {
    backgroundColor: '#11045a',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bubbleText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  rowLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    backgroundColor: '#11045a',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  rowCount: {
    width: 30,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginRight: 8,
  },
  rowIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#11045a',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

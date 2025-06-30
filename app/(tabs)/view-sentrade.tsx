import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

// Replace these with your actual images; using Ashe for all here
import ashe from '../custom/imgs/game/digimon/char/image_1_normal.png';

const { width } = Dimensions.get('window');
const BOX_PADDING = 16;
const BOX_WIDTH = width - BOX_PADDING * 2;
const ITEM_SIZE = (BOX_WIDTH - BOX_PADDING * 2 - 40) / 5; // 5 items + gaps

export default function ViewTradeScreen() {
  const router = useRouter();

  // Dummy arrays of length 5
  const itemsGet = Array(5).fill(ashe);
  const itemsSend = Array(5).fill(ashe);

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={local.container}
    >
      {/* Header */}
      <View style={[local.header, {marginTop: 40, marginBottom: 60}]}>
        <Pressable onPress={() => router.push('../(tabs)/trades')}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Items You Get */}
      <Text style={local.sectionTitle}>Items You get</Text>
      <View style={local.box}>
        <View style={local.titleRow}>
          <Text style={local.boxTitle}>Items You get</Text>
          <Text style={local.arrow}>↓</Text>
        </View>
        <View style={local.itemsRow}>
          {itemsGet.map((img, i) => (
            <View key={i} style={local.itemWrapper}>
              <Image source={img} style={local.itemImage} />
              <Text style={local.itemCount}>1</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Items You Send */}
      <Text style={[local.sectionTitle, { marginTop: 24 }]}>Items You send</Text>
      <View style={local.box}>
        <View style={local.titleRow}>
          <Text style={local.boxTitle}>Items You send</Text>
          <Text style={local.arrow}>↑</Text>
        </View>
        <View style={local.itemsRow}>
          {itemsSend.map((img, i) => (
            <View key={i} style={local.itemWrapper}>
              <Image source={img} style={local.itemImage} />
              <Text style={local.itemCount}>1</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={local.actionsRow}>
        <Pressable style={[local.actionBtn, local.rejectBtn]}>
          <Text style={local.rejectText}>Cancel Trade</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  container: {
    padding: BOX_PADDING,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  box: {
    backgroundColor: '#120437',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    padding: BOX_PADDING,
    width: BOX_WIDTH,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  boxTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
  },
  itemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    alignItems: 'center',
  },
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemCount: {
    color: '#fff',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: BOX_PADDING / 2,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  acceptBtn: {
    backgroundColor: '#28a745',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
  },
  acceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
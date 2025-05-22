// app/(tabs)/trades.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import styles from '../custom/js/styles';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20;
const BOX_WIDTH = width - CONTAINER_PADDING * 2;
const AVATAR_SIZE = 40;

const dummyTrades = [
  { id: '1', name: 'PlayerOne', time: '10 min' },
];

export default function TradesScreen() {
  const router = useRouter();

  const renderSent = (trade: typeof dummyTrades[0]) => (
    <View key={trade.id} style={local.box}>
      <View style={local.tradeRow}>
        <View style={local.leftGroup}>
          <Image
            source={require('../custom/imgs/user/blue.png')}
            style={local.avatar}
          />
          <Text style={local.name}>{trade.name}</Text>
        </View>
        <Text style={local.time}>{trade.time}</Text>
      </View>
      <View style={local.buttonRow}>
        <Pressable
          style={[local.button, local.viewBtn]}
          onPress={() => router.push('/(tabs)/view-sentrade')}
        >
          <Text style={local.viewText}>View Trade</Text>
        </Pressable>
        <Pressable style={[local.button, local.cancelBtn]}>
          <Text style={local.cancelText}>Cancel Trade</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderRequest = (trade: typeof dummyTrades[0]) => (
    <View key={trade.id} style={local.box}>
      <View style={local.tradeRow}>
        <View style={local.leftGroup}>
          <Image
            source={require('../custom/imgs/user/blue.png')}
            style={local.avatar}
          />
          <Text style={local.name}>{trade.name}</Text>
        </View>
        <Text style={local.time}>{trade.time}</Text>
      </View>
      <View style={local.buttonRow}>
        <Pressable
          style={[local.button, local.viewBtn]}
          onPress={() => router.push('/(tabs)/view-trade')}
        >
          <Text style={local.viewText}>View Trade</Text>
        </Pressable>
        <Pressable style={[local.button, local.cancelBtn]}>
          <Text style={local.cancelText}>Cancel Trade</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={local.container}
    >
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      <Text style={local.sectionTitle}>Trades Sent</Text>
      <View style={local.sectionBox}>
        {dummyTrades.map(renderSent)}
      </View>

      <Text style={[local.sectionTitle, { marginTop: 30 }]}>Trade Requests</Text>
      <View style={local.sectionBox}>
        {dummyTrades.map(renderRequest)}
      </View>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  container: {
    padding: CONTAINER_PADDING,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionBox: {
    backgroundColor: '#120437',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fff',
    width: BOX_WIDTH,
    alignSelf: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'column',
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 14,
    color: '#f39c12',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  viewBtn: {
    backgroundColor: '#0d6efd',
  },
  viewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    marginRight: 0,
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
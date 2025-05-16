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
const H_PADDING = 20;
const BOX_WIDTH = width - H_PADDING * 2;

export default function BuildTradeScreen() {
  const router = useRouter();

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

      {/* Items You Get */}
      <Text style={local.sectionTitle}>Items You get</Text>
      <View style={local.box}>
        <Pressable
          onPress={() => router.push('/(tabs)/build-trade-receive')}
          style={local.centerBtn}
        >
          <Image
            source={require('../custom/imgs/menu/receive.png')}
            style={local.centerImage}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Items You Send */}
      <Text style={[local.sectionTitle, { marginTop: 30 }]}>Items You send</Text>
      <View style={local.box}>
        <Pressable
          onPress={() => router.push('/(tabs)/build-trade-send')}
          style={local.centerBtn}
        >
          <Image
            source={require('../custom/imgs/menu/send.png')}
            style={local.centerImage}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Send Proposal */}
      <Pressable
        style={local.sendProposalBtn}
        onPress={() => router.replace('/(tabs)/trades')}
      >
        <Text style={local.sendProposalText}>Send proposal</Text>
      </Pressable>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  container: {
    padding: H_PADDING,
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
  box: {
    backgroundColor: '#120437',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    width: BOX_WIDTH,
    height: BOX_WIDTH * 0.6,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBtn: {
    backgroundColor: 'transparent',
  },
  centerImage: {
    width: BOX_WIDTH * 0.6,
    height: BOX_WIDTH * 0.15,
  },
  sendProposalBtn: {
    backgroundColor: '#0d6efd',
    marginTop: 30,
    marginHorizontal: H_PADDING,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendProposalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
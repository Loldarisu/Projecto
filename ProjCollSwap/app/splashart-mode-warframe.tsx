import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from './custom/js/styles';

import asheImage from './custom/imgs/game/digimon/char/image_1_normal.png';
import splashIcon from './custom/imgs/game/digimon/splashart/agumon.png';

const { width } = Dimensions.get('window');
const INPUT_HEIGHT = 48;
const BUTTON_SIZE = 48;

export default function SplashArtModeScreen() {
  const router = useRouter();
  const [guess, setGuess] = useState('');
  const [triesLeft, setTriesLeft] = useState(5);

  const handleSend = () => {
    if (triesLeft > 0) setTriesLeft(prev => prev - 1);
    setGuess('');
  };

  return (
    <View style={[styles.containerCenter, styles.backgroundPurple]}>
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Title Button */}
      <Pressable style={local.titleButton}>
        <Text style={local.titleButtonText}>Guess today’s warframe!</Text>
      </Pressable>

      {/* Input Row */}
      <View style={local.inputRow}>
        <TextInput
          placeholder="Start typing here..."
          placeholderTextColor="#ccc"
          value={guess}
          onChangeText={setGuess}
          style={local.textInput}
        />
        <Pressable style={local.sendButton} onPress={handleSend}>
          <Ionicons name="paper-plane" size={24} color="#fff" />
        </Pressable>
      </View>
      <Text style={local.triesLeft}>{triesLeft} tries left</Text>

      {/* MODE ICON */}
      <Image source={splashIcon} style={local.modeIcon} />

      {/* SINGLE RESULT CARD */}
      <View style={[local.cardResult, { backgroundColor: '#28a745' }]}>
        <Image source={asheImage} style={local.avatar} />
        <Text style={local.cardResultText}>Ashe</Text>
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  titleButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    height: INPUT_HEIGHT,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    color: '#000',
  },
  sendButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: '#000',
    marginLeft: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triesLeft: {
    width: '100%',
    textAlign: 'left',
    paddingHorizontal: 20,
    color: '#ccc',
    marginBottom: 20,
  },
  modeIcon: {
    width: width * 0.6,
    height: width * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  cardResult: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  cardResultText: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
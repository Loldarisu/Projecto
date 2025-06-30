import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

import asheImage from '../custom/imgs/game/digimon/char/image_1_normal.png';

const { width } = Dimensions.get('window');
const INPUT_HEIGHT = 48;
const BUTTON_SIZE = 48;
const CARD_COUNT = 5;
const CARD_WIDTH = (width - 40 - (CARD_COUNT - 1) * 8) / CARD_COUNT;

export default function ClassicModePage() {
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
      <View style={[local.header, {marginTop: 40, marginBottom: 60}]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Title Button */}
      <Pressable style={local.titleButton}>
        <Text style={local.titleButtonText}>Guess today’s digimon!</Text>
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

      {/* Labels Row */}
      <View style={local.labelsRow}>
        <Text style={local.labelHeader}>Digimon</Text>
        <Text style={local.labelHeader}>Sex</Text>
        <Text style={local.labelHeader}>Type</Text>
        <Text style={local.labelHeader}>Attribute</Text>
        <Text style={local.labelHeader}>Launch Date</Text>
      </View>


      {/* Cards Row */}
      <View style={local.cardsRow}>
        <View style={local.cardItem}>
          <Image source={asheImage} style={local.cardImage} />
        </View>
        <View style={local.cardItemGreen}>
          <Text style={local.cardLabel}>Male</Text>
        </View>
        <View style={local.cardItemGreen}>
          <Text style={local.cardLabel}>Réptil</Text>
        </View>
        <View style={local.cardItemGreen}>
          <Text style={local.cardLabel}>Vaccine</Text>
        </View>
        <View style={local.cardItemGreen}>
          <Text style={local.cardLabel}>2006</Text>
        </View>
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titleButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 12,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  labelHeader: {
    color: '#fff',
    fontSize: 12,
    width: CARD_WIDTH,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  cardItem: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardItemGreen: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#28a745',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '80%',
    height: '80%',
    borderRadius: 4,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
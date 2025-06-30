import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // two cards side-by-side

// Images
const zeroImg = require('../custom/imgs/menu/correct.png'); // replace with your 0% if available
const successImg = require('../custom/imgs/menu/correct.png');

const quests = [
  {
    key: 'digimon',
    title: 'Complete Digimon',
    subtitle: 'Complete all 3 digimon gamemodes',
    img: zeroImg,
    done: false,
  },
  {
    key: 'overwatch',
    title: 'Complete Overwatch',
    subtitle: 'Complete all 3 overwatch gamemodes',
    img: zeroImg,
    done: false,
  },
  {
    key: 'login',
    title: 'Login Bonus',
    subtitle: 'Login every day for a free reward!',
    img: successImg,
    done: true,
  },
  {
    key: 'warframe',
    title: 'Complete Warframe',
    subtitle: 'Complete all 3 warframe gamemodes',
    img: zeroImg,
    done: false,
  },
];

export default function QuestsPage() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={styles.screenContainer}
    >
      {/* Header */}
      <View style={[local.header, {marginTop: 40, marginBottom: 60}]}>
        <Pressable onPress={() => router.push('./my_collection')}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View style={local.gridWrap}>
        {quests.map((q) => (
          <View key={q.key} style={local.card}>
            <Image source={q.img} style={local.cardImage} contentFit="contain" />
            <Text style={local.cardTitle}>{q.title}</Text>
            <Text style={local.cardSubtitle}>{q.subtitle}</Text>
            <Ionicons
              name="gift-outline"
              size={24}
              color={q.done ? '#0f0' : '#fff'}
              style={{ marginTop: 8 }}
            />
          </View>
        ))}
      </View>
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
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'transparent',
    marginBottom: 20,
    alignItems: 'center',
  },
  cardImage: {
    width: CARD_WIDTH * 0.8,
    height: CARD_WIDTH * 0.8,
    borderRadius: (CARD_WIDTH * 0.8) / 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
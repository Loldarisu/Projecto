import { useRouter } from 'expo-router';
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
const CARD_SIZE = (width - 60) / 5; // 5 cards across with margins

// Replace with actual assets
const warframeImages: any[] = Array(12).fill(require('../custom/imgs/example/faded.png'));
const overwatchImages: any[] = Array(12).fill(require('../custom/imgs/example/metallic.png'));
const digimonImages: any[] = Array(12).fill(require('../custom/imgs/example/gold.png'));

interface CardGridProps {
  title: string;
  data: any[];
}

function CardGrid({ title, data }: CardGridProps) {
  const router = useRouter();
  return (
    <View style={local.sectionContainer}>
      <Text style={local.sectionTitle}>{title}</Text>
      <View style={local.gridWrap}>
        {data.map((item: any, index: number) => (
          <Pressable
            key={index}
            style={local.cardWrapper}
          >
            <Image source={item} style={local.cardImage} resizeMode="contain" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function CollectionPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.backgroundPurple} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>{`Username's Collection`}</Text>

      <CardGrid title="warframe" data={warframeImages} />
      <CardGrid title="Overwatch" data={overwatchImages} />
      <CardGrid title="Digimon" data={digimonImages} />

      <Pressable style={local.tradeButton} onPress={() => router.push('/build-trade')}>
        <Text style={local.tradeButtonText}>Trade</Text>
      </Pressable>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#120437',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '90%',
    height: '90%',
  },
  tradeButton: {
    backgroundColor: '#0d6efd',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  tradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
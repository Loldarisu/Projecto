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
const CARD_SIZE = (width - 60) / 5;


const imageSources = {
  warframe: [require('../custom/imgs/example/faded.png')],
  overwatch: [require('../custom/imgs/example/metallic.png')],
  digimon: [require('../custom/imgs/example/gold.png')],
};

interface CardGridProps {
  title: string;
  data: number[];
  onPress: () => void;
}

function CardGrid({ title, data, onPress }: CardGridProps) {
 
  const paddedData = [...data];
  while (paddedData.length < 12) {
    paddedData.push(null);
  }

  return (
    <View style={local.sectionContainer}>
      <Text style={local.sectionTitle}>{title}</Text>
      <View style={local.gridWrap}>
        {paddedData.map((item, index) => (
          <Pressable
            key={index}
            style={local.cardWrapper}
            onPress={() => item && onPress()} 
          >
            {item ? (
              <Image source={item} style={local.cardImage} resizeMode="contain" />
            ) : (
              <View style={local.emptyCard} /> 
            )}
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

      {Object.keys(imageSources).map((key) => (
        <CardGrid
          key={key}
          title={key}
          data={imageSources[key as keyof typeof imageSources]}
          onPress={() => router.push('/card')}
        />
      ))}

      <Pressable style={local.questsButton} onPress={() => router.push('/quests')}>
        <Text style={local.questsButtonText}>Quests</Text>
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
  emptyCard: {
    width: '90%',
    height: '90%',
    backgroundColor: '#555', 
    opacity: 0.3, 
  },
  questsButton: {
    backgroundColor: '#0d6efd',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  questsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
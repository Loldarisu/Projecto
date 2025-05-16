import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

// Demo assets
import goldImg from '../custom/imgs/example/gold.png';
import metallic from '../custom/imgs/example/metallic.png';
import polycrome from '../custom/imgs/example/polycrome.png';
import ashe from '../custom/imgs/game/digimon/char/image_1_normal.png';

const { width } = Dimensions.get('window');
const H_PADDING = 20;
const BOX_WIDTH = width - H_PADDING * 2;
const ITEM_SIZE = (BOX_WIDTH - 40) / 5; // 5 per row, 8px gaps

const rarities = ['Normal', 'Metallic', 'Gold', 'Polycrome'] as const;
const games = ['Warframe', 'Overwatch', 'Digimon'] as const;

export default function BuildTradeReceive() {
  const router = useRouter();
  const [rarity, setRarity] = useState<typeof rarities[number]>('Normal');
  const [game, setGame] = useState<typeof games[number]>('Warframe');
  const [allInputs, setAllInputs] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');

  // build a unique key for this combo
  const comboKey = `${rarity}_${game}`;

  // our "available" counts
  const available = useMemo(() => {
    const base = rarity === 'Gold' && game === 'Warframe' ? 2 : 1;
    return Array(10).fill(base);
  }, [rarity, game]);

  // initialize this combo once
  useEffect(() => {
    setAllInputs(curr => {
      if (curr[comboKey]) return curr;
      return {
        ...curr,
        [comboKey]: available.map(() => '0'),
      };
    });
  }, [comboKey, available]);

  // grab the inputs array (or zeros fallback)
  const inputs = allInputs[comboKey] || available.map(() => '0');

  // user typing in one of the 10 inputs
  const handleInputChange = (text: string, idx: number) => {
    const digits = text.replace(/[^0-9]/g, '');
    const num = parseInt(digits || '0', 10);
    const clamped = Math.min(Math.max(num, 0), available[idx]);
    const next = [...inputs];
    next[idx] = clamped.toString();
    setAllInputs(curr => ({
      ...curr,
      [comboKey]: next,
    }));
  };

  // reset every input back to zero
  const resetAll = () => setAllInputs({});

  const handleBack = () => {
    resetAll();
    router.push('/(tabs)/build-trade');
  };

  const handleSubmit = () => {
    // if all are "0", block and show error
    if (inputs.every(val => val === '0')) {
      setError('Please add at least one card');
      setTimeout(() => setError(''), 1000);
      return;
    }
    // valid: clear and navigate
    resetAll();
    router.push('/(tabs)/build-trade');
  };

  // pick which image to show
  const imgSource = useMemo(() => {
    if (rarity === 'Normal') return ashe;
    if (rarity === 'Metallic') return metallic;
    if (rarity === 'Gold') return goldImg;
    return polycrome;
  }, [rarity]);

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={local.container}
    >
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={handleBack}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Rarity Tabs */}
      <View style={local.tabRow}>
        {rarities.map(r => (
          <Pressable
            key={r}
            style={[local.tab, rarity === r && local.tabActive]}
            onPress={() => setRarity(r)}
          >
            <Text style={[local.tabText, rarity === r && local.tabTextActive]}>
              {r}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Game Tabs */}
      <View style={local.tabRow}>
        {games.map(g => (
          <Pressable
            key={g}
            style={[local.tab, game === g && local.tabActive]}
            onPress={() => setGame(g)}
          >
            <Text style={[local.tabText, game === g && local.tabTextActive]}>
              {g}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Grid of 2 rows × 5 cols */}
      <View style={local.box}>
        {[0, 1].map(row => (
          <View key={row} style={local.row}>
            {available.slice(row * 5, row * 5 + 5).map((avail, idx) => {
              const i = row * 5 + idx;
              return (
                <View key={i} style={local.card}>
                  <Image source={imgSource} style={local.cardImage} />
                  <Text style={local.cardLabel}>{avail}</Text>
                  <TextInput
                    style={local.cardInput}
                    value={inputs[i]}
                    keyboardType="numeric"
                    onChangeText={t => handleInputChange(t, i)}
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {error ? <Text style={local.errorText}>{error}</Text> : null}

      {/* Submit */}
      <Pressable style={local.submitBtn} onPress={handleSubmit}>
        <Text style={local.submitText}>Submit</Text>
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
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#11045a',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0d6efd',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#11045a',
    fontWeight: '600',
  },
  box: {
    backgroundColor: '#120437',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    alignSelf: 'center',
    width: BOX_WIDTH,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    alignItems: 'center',
    width: ITEM_SIZE,
  },
  cardImage: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.8,
    borderRadius: 8,
    marginBottom: 4,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  cardInput: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.6,
    backgroundColor: '#fff',
    borderRadius: 4,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    marginTop: 2,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  submitBtn: {
    backgroundColor: '#28a745',
    marginTop: 24,
    marginHorizontal: H_PADDING,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
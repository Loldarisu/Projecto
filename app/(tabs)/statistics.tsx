import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../../utils/supabase';
import styles from '../custom/js/styles';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width - 40;
const ROW_LABEL_WIDTH = BAR_WIDTH * 0.7;
const ROW_VALUE_SIZE = 40;

export default function StatisticsPage() {
  const router = useRouter();

  const [statsData, setStatsData] = useState({
    wins: 0,
    losses: 0,
    winRatio: 0,
    currentStreak: 0,
    maxStreak: 0,
    oneShots: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const userId = user.id;

      let { data: statsRow, error } = await supabase
        .from('statistics')
        .select()
        .eq('user_id', userId)
        .single();

      if (error) {
        // create a new row if none exists
        await supabase.from('statistics').insert({ user_id: userId });
        statsRow = {
          wins: 0,
          losses: 0,
          one_shots: 0,
          current_streak: 0,
          max_win_streak: 0,
        };
      }

      const wins = statsRow.wins;
      const losses = statsRow.losses;
      const oneShots = statsRow.one_shots;
      const currentStreak = statsRow.current_streak;
      const maxStreak = statsRow.max_win_streak;
      const winRatio = losses > 0 ? (wins / losses).toFixed(2) : wins;

      setStatsData({
        wins,
        losses,
        winRatio,
        currentStreak,
        maxStreak,
        oneShots,
      });
    }

    loadStats();
  }, []);

  const progress = {
    warframe: 0.2,
    overwatch: 0.3,
    digimon: 0.25,
  };

  const statsList = [
    { label: 'Wins', value: statsData.wins },
    { label: 'Losses', value: statsData.losses },
    { label: 'Wins/Losses', value: statsData.winRatio },
    { label: 'Win Streak', value: statsData.currentStreak },
    { label: 'Max win streak', value: statsData.maxStreak },
    { label: 'One-Shots', value: statsData.oneShots },
  ];

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={styles.screenContainer}
    >
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>
            {'<- Back'}
          </Text>
        </Pressable>
      </View>

      {/* Progress Bars */}
      <View style={local.progressContainer}>
        {(['warframe', 'overwatch', 'digimon'] as const).map((key) => (
          <View key={key} style={local.progressRow}>
            <Text style={local.progressLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <View style={local.progressBarBackground}>
              <View
                style={[
                  local.progressBarFill,
                  { width: BAR_WIDTH * (progress[key] || 0) },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Stats Rows */}
      {statsList.map((s, i) => (
        <View key={i} style={local.statRow}>
          <View style={local.statLabelBubble}>
            <Text style={local.statLabelText}>{s.label}</Text>
          </View>
          <View style={local.statValueCircle}>
            <Text style={local.statValueText}>{s.value}</Text>
          </View>
        </View>
      ))}
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
  progressContainer: {
    backgroundColor: '#120437',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  progressBarBackground: {
    width: BAR_WIDTH,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#0d6efd',
    borderRadius: 5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statLabelBubble: {
    width: ROW_LABEL_WIDTH,
    backgroundColor: '#120437',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statValueCircle: {
    width: ROW_VALUE_SIZE,
    height: ROW_VALUE_SIZE,
    backgroundColor: '#120437',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: ROW_VALUE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValueText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
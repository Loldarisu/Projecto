import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

const { width } = Dimensions.get('window');
const H_PADDING = 20;
const CARD_WIDTH = width - H_PADDING * 2;
const AVATAR_SIZE = 40;

const THREADS = [
  {
    id: '1',
    title: 'Looking to Trade Rare',
    preview: 'For Trade:\n• Holo Dragonfire (Limited Edition)...',
    time: '9 min',
    avatar: require('../custom/imgs/user/black.png'), // your icon
  },
  {
    id: '2',
    title: 'Nouns',
    preview: 'Hello Guys ...',
    time: '10 min',
    avatar: require('../custom/imgs/user/blue.png'),
  },
  {
    id: '3',
    title: 'just chat',
    preview: 'Hello again',
    time: '27 min',
    avatar: require('../custom/imgs/user/blue.png'),
  },
  {
    id: '4',
    title: 'Error trading',
    preview: 'Hello guys i have a problem...',
    time: '30 min',
    avatar: require('../custom/imgs/user/blue.png'),
  },
];

export default function ForumScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // filter threads by title includes search (case-insensitive)
  const filtered = useMemo(
    () =>
      THREADS.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
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
        <Pressable
          onPress={() => router.push('/(tabs)/create-thread')}
          style={local.addBtn}
        >
          <Ionicons name="add" size={24} color="#11045a" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <TextInput
        placeholder="Start typing to search"
        placeholderTextColor="#999"
        style={local.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      {/* Thread List */}
      {filtered.map((t) => (
        <Pressable
          key={t.id}
          style={local.card}
          onPress={() => router.push(`/(tabs)/thread`)}
        >
          <View style={local.cardRow}>
            <Image source={t.avatar} style={local.avatar} />
            <View style={local.textGroup}>
              <Text style={local.title}>{t.title}</Text>
              <Text style={local.preview} numberOfLines={1}>
                {t.preview}
              </Text>
            </View>
            <Text style={local.time}>{t.time}</Text>
          </View>
        </Pressable>
      ))}

      {/* No results */}
      {filtered.length === 0 && (
        <Text style={local.noResults}>No threads found.</Text>
      )}
    </ScrollView>
  );
}

const local = StyleSheet.create({
  container: {
    padding: H_PADDING,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#f39c12',
    marginLeft: 12,
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
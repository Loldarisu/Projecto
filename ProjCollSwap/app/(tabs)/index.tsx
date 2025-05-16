import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from '../custom/js/styles';

import collection from '../custom/imgs/menu/collection.png';
import digimonImg from '../custom/imgs/menu/digimongame.png';
import forum from '../custom/imgs/menu/forum.png';
import overwatch from '../custom/imgs/menu/overwatchgame.png';
import statistics from '../custom/imgs/menu/statistics.png';
import trades from '../custom/imgs/menu/trades.png';
import warframe from '../custom/imgs/menu/warframegame.png';

export default function HomeScreen() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <View style={[styles.screenContainer, styles.backgroundPurple]}>
      {/* Header */}
      <View style={[styles.header, { justifyContent: 'flex-end' }]}>
        <View style={styles.headerRight}>
          <Pressable onPress={() => { setShowMenu(!showMenu); setShowNotifs(false); }}>
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </Pressable>
          <Pressable onPress={() => { setShowNotifs(!showNotifs); setShowMenu(false); }}>
            <Ionicons name="notifications-outline" size={24} color="#fff" style={{ marginLeft: 16 }} />
          </Pressable>          
        </View>
      </View>
      {/* Notifications */}
      {showNotifs && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownItem}>No new notifications</Text>
        </View>
      )}

      {/* Menu */}
      {showMenu && (
        <View style={[styles.dropdown]}>
          <Pressable onPress={() => { setShowMenu(false); router.push('/report'); }}>
            <Text style={styles.dropdownItem}>Report</Text>
          </Pressable>
          <Pressable onPress={() => { setShowMenu(false); router.push('/settings'); }}>
            <Text style={styles.dropdownItem}>Settings</Text>
          </Pressable>
        </View>
      )}

      {/* Games Section */}
      <Text style={styles.sectionTitle}>Games</Text>

      {/* First row: Warframe + Overwatch */}
      <View style={styles.sectionRow}>
        <Pressable style={styles.gridItem} onPress={() => router.push('/gamemodes-warframe')}>
          <Image source={warframe} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Warframe</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push('/gamemodes-overwatch')}>
          <Image source={overwatch} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Overwatch</Text>
        </Pressable>
      </View>

      {/* Second row: Digimon centered */}
      <View style={styles.sectionRowCenter}>
        <Pressable style={styles.gridItem} onPress={() => router.push('/gamemodes-digimon')}>
          <Image source={digimonImg} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Digimon</Text>
        </Pressable>
      </View>

      {/* Cards Section */}
      <Text style={styles.sectionTitle}>Cards</Text>
      <View style={styles.sectionRow}>
        <Pressable style={styles.gridItem} onPress={() => router.push('/my_collection')}>
          <Image source={collection} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>My collection</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push('/statistics')}>
          <Image source={statistics} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Statistics</Text>
        </Pressable>
      </View>

      {/* Chat Section */}
      <Text style={styles.sectionTitle}>Chat</Text>
      <View style={styles.sectionRow}>
        <Pressable style={styles.gridItem} onPress={() => router.push('/forum')}>
          <Image source={forum} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Forum</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push('/trades')}>
          <Image source={trades} style={styles.imageOnly} />
          <Text style={styles.imageLabel}>Trades</Text>
        </Pressable>
      </View>
    </View>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { supabase } from '../../utils/supabase';
import styles from '../custom/js/styles';

const { width } = Dimensions.get('window');
const INPUT_HEIGHT = 48;
const BUTTON_SIZE = 48;

// --- Statistics Helpers ---
async function recordWin(guessCount: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  let { data: statsRow, error } = await supabase
    .from('statistics')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    // create if missing
    await supabase.from('statistics').insert({ user_id: userId });
    statsRow = { wins: 0, losses: 0, one_shots: 0, current_streak: 0, max_win_streak: 0 };
  }

  const newStreak = (statsRow.current_streak || 0) + 1;
  const newMax = Math.max(statsRow.max_win_streak || 0, newStreak);
  const updates: any = {
    wins: (statsRow.wins || 0) + 1,
    current_streak: newStreak,
    max_win_streak: newMax,
  };
  if (guessCount === 1) {
    updates.one_shots = (statsRow.one_shots || 0) + 1;
  }
  await supabase.from('statistics').update(updates).eq('user_id', userId);
}

async function recordLoss() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  let { data: statsRow, error } = await supabase
    .from('statistics')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    await supabase.from('statistics').insert({ user_id: userId });
    statsRow = { wins: 0, losses: 0, one_shots: 0, current_streak: 0, max_win_streak: 0 };
  }

  await supabase
    .from('statistics')
    .update({
      losses: (statsRow.losses || 0) + 1,
      current_streak: 0,
    })
    .eq('user_id', userId);
}
// -----------------------------

export default function AbilitiesModeScreen() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);
  const [modeChar, setModeChar] = useState<any>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [dropdownChars, setDropdownChars] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetch past guesses...
  const fetchGuesses = async (sessId: number) => {
    try {
      const { data: rows } = await supabase
        .from('game_guesses')
        .select('guess_char_id, correct_fields')
        .eq('session_id', sessId)
        .order('created_at', { ascending: true });
      if (!rows) return;
      const ids = rows.map(r => r.guess_char_id);
      const { data: chars } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .in('id', ids);
      const loaded = rows
        .map(r => {
          const c = chars?.find(x => x.id === r.guess_char_id);
          return c
            ? {
                id: c.id,
                name: c.name,
                image: c.character_image,
                correct: r.correct_fields.character === true,
              }
            : null;
        })
        .filter(x => x);
      setGuesses(loaded as any[]);
    } catch (e) {
      console.error(e);
    }
  };

  // init / resume session
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        setLoading(true);
        const {
          data: { session },
          error: authErr,
        } = await supabase.auth.getSession();
        if (authErr || !session?.user) {
          console.error(authErr);
          setLoading(false);
          return;
        }
        const userId = session.user.id;
        const modeId = 1; // abilities

        let { data: gameSession } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('mode_id', modeId)
          .maybeSingle();

        if (!gameSession) {
          const { data: allChars } = await supabase
            .from('characters')
            .select('id, name, ability_image, overwatch_role')
            .eq('genre', 'Overwatch');
          const random = allChars![Math.floor(Math.random() * allChars!.length)];
          const { data: newSession } = await supabase
            .from('game_sessions')
            .insert({
              user_id: userId,
              mode_id: modeId,
              play_date: new Date().toISOString().slice(0, 10),
              character_id: random.id,
              tries_left: 5,
              state: 'ongoing',
            })
            .select()
            .single();
          gameSession = newSession!;
          setModeChar(random);
        } else {
          const { data: charData } = await supabase
            .from('characters')
            .select('id, name, ability_image, overwatch_role')
            .eq('id', gameSession.character_id)
            .single();
          setModeChar(charData!);
        }

        setSessionData(gameSession!);
        await fetchGuesses(gameSession!.id);
        setLoading(false);
      };
      init();
    }, [])
  );

  const handleFocus = async () => {
    setDropdownVisible(true);
    if (!dropdownChars.length) {
      const { data } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .eq('genre', 'Overwatch');
      setDropdownChars(data || []);
    }
  };

  const handleSelect = (c: any) => {
    setGuessInput(c.name);
    setDropdownVisible(false);
  };

  const handleSend = async () => {
    if (!sessionData) return;
    setErrorMessage('');
    try {
      const { data: match } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .eq('genre', 'Overwatch')
        .ilike('name', guessInput.trim())
        .maybeSingle();
      if (!match) throw new Error();

      const isCorrect = match.id === sessionData.character_id;
      await supabase.from('game_guesses').insert({
        session_id: sessionData.id,
        guess_char_id: match.id,
        correct_fields: { character: isCorrect },
      });
      await fetchGuesses(sessionData.id);

      if (isCorrect) {
        setGameResult('win');
        await supabase.from('game_sessions').update({ state: 'win' }).eq('id', sessionData.id);
        // record stats (passes guess count = guesses.length + 1)
        await recordWin(guesses.length + 1);
      } else {
        const newTries = sessionData.tries_left - 1;
        await supabase
          .from('game_sessions')
          .update({ tries_left: newTries, state: newTries <= 0 ? 'loss' : 'ongoing' })
          .eq('id', sessionData.id);
        setSessionData((s: any) => ({ ...s, tries_left: newTries }));
        if (newTries <= 0) {
          setGameResult('loss');
          await recordLoss();
        }
      }
      setGuessInput('');
    } catch {
      setErrorMessage('please input a valid name');
    }
  };

  // end-game effect
  useEffect(() => {
    if (!gameResult || !sessionData?.id) return;
    setModalVisible(true);
    const t = setTimeout(async () => {
      setModalVisible(false);
      await supabase.from('game_guesses').delete().eq('session_id', sessionData.id);
      await supabase.from('game_sessions').delete().eq('id', sessionData.id);
      setSessionData(null);
      setModeChar(null);
      setGuesses([]);
      setGameResult(null);
      router.replace('/gamemodes-overwatch');
    }, 2000);
    return () => clearTimeout(t);
  }, [gameResult, sessionData]);

  if (loading || !sessionData) {
    return (
      <View style={[styles.containerCenter, styles.backgroundPurple]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.backgroundPurple} contentContainerStyle={styles.backgroundPurple}>
      {/* Header */}
      <View style={[local.header, {marginTop: 40, marginBottom: 60}]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>
      {/* Title */}
      <Pressable style={local.titleButton}>
        <Text style={local.titleButtonText}>Guess today’s hero!</Text>
      </Pressable>
      {/* Input */}
      <View style={local.inputRow}>
        <TextInput
          placeholder="Start typing here..."
          placeholderTextColor="#ccc"
          value={guessInput}
          onChangeText={setGuessInput}
          onFocus={handleFocus}
          style={local.textInput}
        />
        <Pressable style={local.sendButton} onPress={handleSend}>
          <Ionicons name="paper-plane" size={24} color="#fff" />
        </Pressable>
      </View>
      {/* Dropdown */}
      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={local.dropdownOverlay} />
        </TouchableWithoutFeedback>
      )}
      {dropdownVisible && (
        <View style={local.dropdownContainer}>
          {dropdownChars
            .filter(c => c.name.toLowerCase().includes(guessInput.toLowerCase()))
            .map(c => (
              <Pressable key={c.id} onPress={() => handleSelect(c)}>
                <View style={local.dropdownItem}>
                  <Image source={{ uri: c.character_image }} style={local.dropdownAvatar} />
                  <Text>{c.name}</Text>
                </View>
              </Pressable>
            ))}
        </View>
      )}
      {errorMessage ? <Text style={local.error}>{errorMessage}</Text> : null}
      {/* Tries Left */}
      <Text style={local.triesLeft}>{sessionData.tries_left} tries left</Text>
      {/* Ability Icon */}
      {modeChar && <Image source={{ uri: modeChar.ability_image }} style={local.modeIcon} />}
      {/* Role Hint */}
      {sessionData.tries_left <= 3 && modeChar && (
        <Text style={local.roleHint}>Role: {modeChar.overwatch_role}</Text>
      )}
      {/* Guess Cards */}
      {guesses.map((g, i) => (
        <View key={i} style={[local.cardResult, { backgroundColor: g.correct ? '#28a745' : '#dc3545' }]}>
          <Image source={{ uri: g.image }} style={local.avatar} />
          <Text style={local.cardResultText}>{g.name}</Text>
        </View>
      ))}
      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={local.modalBackdrop}>
          <View style={[local.modalBox, { backgroundColor: gameResult === 'win' ? '#28a745' : '#dc3545' }]}>
            <Text style={local.modalText}>{gameResult === 'win' ? 'You have won!' : 'You have lost!'}</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  header: { width: '100%', paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  titleButton: { borderWidth: 1, borderColor: '#fff', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 24, alignSelf: 'center', marginBottom: 20 },
  titleButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  inputRow: { flexDirection: 'row', width: '100%', paddingHorizontal: 20, alignItems: 'center', marginBottom: 4 },
  textInput: { flex: 1, height: INPUT_HEIGHT, backgroundColor: '#e0e0e0', borderRadius: 6, paddingHorizontal: 12, color: '#000' },
  sendButton: { width: BUTTON_SIZE, height: BUTTON_SIZE, backgroundColor: '#000', marginLeft: 8, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  dropdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dropdownContainer: { position: 'absolute', top: INPUT_HEIGHT * 3 + 40, width: '100%', paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 6, maxHeight: INPUT_HEIGHT * 9, zIndex: 999, elevation: 10 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  dropdownAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  error: { color: 'red', paddingHorizontal: 20, marginBottom: 8 },
  triesLeft: { width: '100%', textAlign: 'left', paddingHorizontal: 20, color: '#ccc', marginBottom: 20 },
  modeIcon: { width: width * 0.6, height: width * 0.6, resizeMode: 'contain', alignSelf: 'center', marginBottom: 30 },
  roleHint: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  cardResult: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 16, width: '90%', alignSelf: 'center', marginBottom: 40 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  cardResultText: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '600', textAlign: 'center' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBox: { padding: 20, borderRadius: 10 },
  modalText: { color: '#fff', fontSize: 18 },
});
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { supabase } from '../utils/supabase';
import styles from './custom/js/styles';

const { width } = Dimensions.get('window');
const INPUT_HEIGHT = 48;
const BUTTON_SIZE = 48;

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

  // Helper to fetch and set past guesses
  const fetchGuesses = async (sessId: number) => {
    try {
      const { data: guessRows, error: guessErr } = await supabase
        .from('game_guesses')
        .select('guess_char_id, correct_fields')
        .eq('session_id', sessId)
        .order('created_at', { ascending: true });
      if (guessErr) throw guessErr;
      const charIds = guessRows?.map((g: any) => g.guess_char_id) || [];
      if (!charIds.length) {
        setGuesses([]);
        return;
      }
      const { data: charsData, error: charErr } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .in('id', charIds);
      if (charErr) throw charErr;
      const loaded = guessRows
        .map((g: any) => {
          const c = charsData?.find((x: any) => x.id === g.guess_char_id);
          if (!c) return null;
          return {
            id: c.id,
            name: c.name,
            image: c.character_image,
            correct: g.correct_fields.character === true
          };
        })
        .filter((x: any) => x != null);
      setGuesses(loaded as any[]);
    } catch (error) {
      console.error('Error loading past guesses', error);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      // Get Supabase Auth session & user
      const {
        data: { session },
        error: authError
      } = await supabase.auth.getSession();
      if (authError || !session?.user) {
        console.error('Auth error', authError);
        setLoading(false);
        return;
      }
      const userId = session.user.id;

      // Lookup mode_id for "abilities", needed this because of the way our database was set up
      const { data: modeRow, error: modeErr } = await supabase
        .from('modes')
        .select('id')
        .eq('name', 'abilities')
        .maybeSingle();
      if (modeErr && modeErr.code !== 'PGRST116') {
        console.error('Error fetching mode ID', modeErr);
        setLoading(false);
        return;
      }
      if (!modeRow) {
        console.error('Mode not found: abilities-mode-overwatch');
        setLoading(false);
        return;
      }
      const modeId = modeRow.id;

      // Check for existing session
      let { data: existingSession, error: sessionErr } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('mode_id', modeId)
        .maybeSingle();
      if (sessionErr && sessionErr.code !== 'PGRST116') {
        console.error('Error fetching game session', sessionErr);
      }

      // If none, create new session with random Overwatch char
      if (!existingSession) {
        const { data: allChars, error: charErr } = await supabase
          .from('characters')
          .select('id, name, ability_image, overwatch_role')
          .eq('genre', 'Overwatch');
        if (charErr || !allChars?.length) {
          console.error('Error loading characters', charErr);
          setLoading(false);
          return;
        }
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];

        const { data: newSession, error: insertErr } = await supabase
          .from('game_sessions')
          .insert({
            user_id: userId,
            mode_id: modeId,
            play_date: new Date().toISOString().slice(0, 10),
            character_id: randomChar.id,
            tries_left: 5,
            state: 'ongoing'
          })
          .select()
          .single();
        if (insertErr) {
          console.error('Error creating game session', insertErr);
          setLoading(false);
          return;
        }
        existingSession = newSession;
        setModeChar(randomChar);
      } else {
        const { data: charData, error: charErr2 } = await supabase
          .from('characters')
          .select('id, name, ability_image, overwatch_role')
          .eq('id', existingSession.character_id)
          .single();
        if (charErr2) console.error('Error fetching character', charErr2);
        setModeChar(charData);
      }

      setSessionData(existingSession);
      await fetchGuesses(existingSession.id);
      setLoading(false);
    };

    initSession();
  }, []);

  // Dropdown handlers
  const handleFocus = async () => {
    setDropdownVisible(true);
    if (!dropdownChars.length) {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .eq('genre', 'Overwatch');
      if (error) console.error('Error fetching dropdown chars', error);
      else setDropdownChars(data);
    }
  };
  const handleSelectChar = (char: any) => {
    setGuessInput(char.name);
    setDropdownVisible(false);
  };

  // Handle guess submission
  const handleSend = async () => {
    if (!sessionData) return;
    setErrorMessage('');

    try {
      const { data: match, error: matchErr } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .eq('genre', 'Overwatch')
        .ilike('name', guessInput.trim())
        .maybeSingle();
      if (matchErr || !match) {
        throw new Error('invalid');
      }

      const isCorrect = match.id === sessionData.character_id;

      const { error: insertErr } = await supabase
        .from('game_guesses')
        .insert({
          session_id: sessionData.id,
          guess_char_id: match.id,
          correct_fields: { character: isCorrect }
        });
      if (insertErr) throw insertErr;

      await fetchGuesses(sessionData.id);

      if (isCorrect) {
        setGameResult('win');
        await supabase.from('game_sessions').update({ state: 'win' }).eq('id', sessionData.id);
      } else {
        const newTries = sessionData.tries_left - 1;
        await supabase
          .from('game_sessions')
          .update({ tries_left: newTries, state: newTries <= 0 ? 'loss' : 'ongoing' })
          .eq('id', sessionData.id);
        setSessionData((s: any) => ({ ...s, tries_left: newTries }));
        if (newTries <= 0) setGameResult('loss');
      }
    } catch (err) {
      setErrorMessage('please input a valid name');
      console.error('Guess error', err);
    }
  };

  // End-of-game cleanup modal
  useEffect(() => {
    if (!gameResult || !sessionData?.id) return;
    setModalVisible(true);
    const timer = setTimeout(async () => {
      setModalVisible(false);
      await supabase.from('game_guesses').delete().eq('session_id', sessionData.id);
      await supabase.from('game_sessions').delete().eq('id', sessionData.id);
      setSessionData(null);
      setModeChar(null);
      setGuesses([]);
      setGameResult(null);
      router.replace('/gamemodes-overwatch');
    }, 2000);
    return () => clearTimeout(timer);
  }, [gameResult, sessionData?.id]);

  // Guard against rendering before data loads
  if (loading || !sessionData) {
    return (
      <View style={[styles.containerCenter, styles.backgroundPurple]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.backgroundPurple]}>
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Title Button */}
      <Pressable style={local.titleButton}>
        <Text style={local.titleButtonText}>Guess today’s hero!</Text>
      </Pressable>

      {/* Input Row */}
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
        <View style={{ width: '100%', paddingHorizontal: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 6, maxHeight: 200 }}>
            {dropdownChars
              .filter((c) => c.name.toLowerCase().includes(guessInput.toLowerCase()))
              .map((c) => (
                <Pressable key={c.id} onPress={() => handleSelectChar(c)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                    <Image
                      source={{ uri: c.character_image }}
                      style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                    />
                    <Text>{c.name}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
      )}

      {/* Error Message */}
      {errorMessage ? (
        <Text style={{ color: 'red', paddingHorizontal: 20 }}>{errorMessage}</Text>
      ) : null}

      {/* Tries Left */}
      <Text style={local.triesLeft}>{sessionData.tries_left} tries left</Text>

      {/* Ability Icon */}
      {modeChar && (
        <Image source={{ uri: modeChar.ability_image }} style={local.modeIcon} />
      )}

      {/* Role Hint */}
      {sessionData.tries_left <= 3 && modeChar && (
        <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Role: {modeChar.overwatch_role}
        </Text>
      )}

      {/* Guess Result Cards */}
      {guesses.map((g, idx) => (
        <View
          key={idx}
          style={[local.cardResult, { backgroundColor: g.correct ? '#28a745' : '#dc3545' }]}>
          <Image source={{ uri: g.image }} style={local.avatar} />
          <Text style={local.cardResultText}>{g.name}</Text>
        </View>
      ))}

      {/* End-Game Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={local.modalBackdrop}>
          <View
            style={[
              local.modalBox,
              { backgroundColor: gameResult === 'win' ? '#28a745' : '#dc3545' }
            ]}>
            <Text style={local.modalText}>
              {gameResult === 'win' ? 'You have won!' : 'You have lost!'}
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20
  },
  titleButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 20
  },
  titleButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 4
  },
  textInput: {
    flex: 1,
    height: INPUT_HEIGHT,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    color: '#000'
  },
  sendButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: '#000',
    marginLeft: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  triesLeft: {
    width: '100%',
    textAlign: 'left',
    paddingHorizontal: 20,
    color: '#ccc',
    marginBottom: 20
  },
  modeIcon: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30
  },
  cardResult: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 40
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  cardResultText: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center'
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    padding: 20,
    borderRadius: 10
  },
  modalText: {
    color: '#fff',
    fontSize: 18
  }
});
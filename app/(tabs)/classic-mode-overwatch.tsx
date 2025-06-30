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
  View
} from 'react-native';
import { supabase } from '../../utils/supabase';
import styles from '../custom/js/styles';

const { width } = Dimensions.get('window');
const INPUT_HEIGHT = 48;
const BUTTON_SIZE = 48;
const CARD_COUNT = 5;
const CARD_WIDTH = (width - 40 - (CARD_COUNT - 1) * 8) / CARD_COUNT;

export default function ClassicModeScreen() {
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

  // Fetch past guesses and their correctness
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
        .select('id, name, character_image, sex, launch_date, overwatch_nationality, overwatch_role')
        .in('id', charIds);
      if (charErr) throw charErr;

      const loaded = (guessRows as any[]).map(g => {
        const c = charsData?.find((x: any) => x.id === g.guess_char_id);
        if (!c) return null;
        return {
          id: c.id,
          name: c.name,
          image: c.character_image,
          sex: c.sex,
          nationality: c.overwatch_nationality,
          role: c.overwatch_role,
          launch_date: c.launch_date,
          correct: g.correct_fields || {}
        };
      }).filter(x => x != null) as any[];

      setGuesses(loaded);
    } catch (error) {
      console.error('Error loading past guesses', error);
    }
  };

  // Initialize or resume game session
  useFocusEffect(
    useCallback(() => {
      const initSession = async () => {
        try {
          const { data: { session }, error: authError } = await supabase.auth.getSession();
          if (authError || !session?.user) {
            console.error('Auth error', authError);
            setLoading(false);
            return;
          }
          const userId = session.user.id;
          const modeId = 2; // Classic mode

          let { data: existingSession, error: sessionErr } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('mode_id', modeId)
            .maybeSingle();
          if (sessionErr && sessionErr.code !== 'PGRST116') {
            console.error('Error fetching game session', sessionErr);
          }

          if (!existingSession) {
            // Create new session
            const { data: allChars, error: charErr } = await supabase
              .from('characters')
              .select('id, name, character_image, sex, launch_date, overwatch_nationality, overwatch_role')
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
            existingSession = newSession as any;
            setModeChar(randomChar);
          } else {
            // Load chosen character details
            const { data: charData, error: charErr2 } = await supabase
              .from('characters')
              .select('id, name, character_image, sex, launch_date, overwatch_nationality, overwatch_role')
              .eq('id', existingSession.character_id)
              .maybeSingle();
            if (charErr2) console.error('Error fetching character', charErr2);
            setModeChar(charData);
          }

          setSessionData(existingSession as any);
          await fetchGuesses((existingSession as any).id);
          setLoading(false);
        } catch (e) {
          console.error('Initialization error', e);
          setLoading(false);
        }
      };

      initSession();
    }, [])
  );

  // Show dropdown on input focus
  const handleFocus = async () => {
    setDropdownVisible(true);
    if (!dropdownChars.length) {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, character_image')
        .eq('genre', 'Overwatch');
      if (error) console.error('Error fetching dropdown chars', error);
      else setDropdownChars(data as any[]);
    }
  };

  // Select from dropdown
  const handleSelectChar = (char: any) => {
    setGuessInput(char.name);
    setDropdownVisible(false);
  };

  // Submit guess
  const handleSend = async () => {
    if (!sessionData) return;
    setErrorMessage('');

    try {
      // Find matching character by name
      const { data: match, error: matchErr } = await supabase
        .from('characters')
        .select('id, name, character_image, sex, launch_date, overwatch_nationality, overwatch_role')
        .eq('genre', 'Overwatch')
        .ilike('name', guessInput.trim())
        .maybeSingle();
      if (matchErr || !match) {
        throw new Error('invalid');
      }

      const isCorrect = match.id === (sessionData as any).character_id;
      if (isCorrect) {
        // Immediate win
        setGameResult('win');
        await supabase
          .from('game_sessions')
          .update({ state: 'win' })
          .eq('id', (sessionData as any).id);
      } else {
        // Determine correctness of each field
        const correctFields = {
          name: match.name === modeChar?.name,
          sex: match.sex === modeChar?.sex,
          overwatch_nationality: match.overwatch_nationality === modeChar?.overwatch_nationality,
          overwatch_role: match.overwatch_role === modeChar?.overwatch_role,
          launch_date: match.launch_date === modeChar?.launch_date
        };
        const { error: insertErr } = await supabase
          .from('game_guesses')
          .insert({
            session_id: (sessionData as any).id,
            guess_char_id: match.id,
            correct_fields: correctFields
          });
        if (insertErr) throw insertErr;

        await fetchGuesses((sessionData as any).id);
        // Decrement tries
        const newTries = (sessionData as any).tries_left - 1;
        await supabase
          .from('game_sessions')
          .update({ tries_left: newTries, state: newTries <= 0 ? 'loss' : 'ongoing' })
          .eq('id', (sessionData as any).id);
        setSessionData((s: any) => ({ ...s, tries_left: newTries }));
        if (newTries <= 0) {
          setGameResult('loss');
        }
      }
    } catch {
      setErrorMessage('please input a valid name');
    }
  };

  // Handle end of game
  useEffect(() => {
    if (!gameResult || !(sessionData as any)?.id) return;
    setModalVisible(true);
    const timer = setTimeout(async () => {
      setModalVisible(false);
      await supabase.from('game_guesses').delete().eq('session_id', (sessionData as any).id);
      await supabase.from('game_sessions').delete().eq('id', (sessionData as any).id);
      setSessionData(null);
      setModeChar(null);
      setGuesses([]);
      setGameResult(null);
      router.replace('/gamemodes-overwatch');
    }, 2000);
    return () => clearTimeout(timer);
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
      {/* Dropdown Overlay */}
      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={local.dropdownOverlay} />
        </TouchableWithoutFeedback>
      )}
      {/* Dropdown List */}
      {dropdownVisible && (
        <View style={local.dropdownContainer}>
          {dropdownChars
            .filter(c => c.name.toLowerCase().includes(guessInput.toLowerCase()))
            .map(c => (
              <Pressable key={c.id} onPress={() => handleSelectChar(c)}>
                <View style={local.dropdownItem}>
                  <Image source={{ uri: c.character_image }} style={local.dropdownAvatar} />
                  <Text>{c.name}</Text>
                </View>
              </Pressable>
          ))}
        </View>
      )}
      {/* Error Message */}
      {errorMessage ? (
        <Text style={{ color: 'red', paddingHorizontal: 20 }}>{errorMessage}</Text>
      ) : null}
      {/* Tries Left */}
      <Text style={local.triesLeft}>{(sessionData as any).tries_left} tries left</Text>
      {/* Labels Row */}
      <View style={local.labelsRow}>
        <Text style={local.labelHeader}>Hero</Text>
        <Text style={local.labelHeader}>Sex</Text>
        <Text style={local.labelHeader}>Nationality</Text>
        <Text style={local.labelHeader}>Role</Text>
        <Text style={local.labelHeader}>Launch Date</Text>
      </View>
      {/* Feedback Rows */}
      {guesses.map((g, idx) => (
        <View key={idx} style={local.cardsRow}>
          <View style={local.cardItem}>
            <Image source={{ uri: g.image }} style={local.cardImage} />
          </View>
          <View style={g.correct.sex ? local.cardItemGreen : local.cardItemRed}>
            <Text style={local.cardLabel}>{g.sex}</Text>
          </View>
          <View style={g.correct.overwatch_nationality ? local.cardItemGreen : local.cardItemRed}>
            <Text style={local.cardLabel}>{g.nationality}</Text>
          </View>
          <View style={g.correct.overwatch_role ? local.cardItemGreen : local.cardItemRed}>
            <Text style={local.cardLabel}>{g.role}</Text>
          </View>
          <View style={g.correct.launch_date ? local.cardItemGreen : local.cardItemRed}>
            <Text style={local.cardLabel}>{g.launch_date}</Text>
          </View>
        </View>
      ))}
      {/* End-Game Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={local.modalBackdrop}>
          <View style={[local.modalBox, { backgroundColor: gameResult === 'win' ? '#28a745' : '#dc3545' }]}>
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
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 8
  },
  labelHeader: {
    color: '#fff',
    fontSize: 12,
    width: CARD_WIDTH,
    textAlign: 'center'
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 12
  },
  cardItem: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardItemGreen: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#28a745',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardItemRed: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#dc3545',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardImage: {
    width: '80%',
    height: '80%',
    borderRadius: 4
  },
  cardLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center'
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  dropdownContainer: {
    position: 'absolute',
    top: INPUT_HEIGHT * 3 + 40,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    maxHeight: INPUT_HEIGHT * 9,
    zIndex: 999,
    elevation: 10
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  dropdownAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8
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
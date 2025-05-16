import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from '../custom/js/styles';

const { width, height } = Dimensions.get('window');
const BOX_PADDING = 16;
const BOX_WIDTH = width - BOX_PADDING * 2;
const BOX_HEIGHT = height * 0.6;

export default function CreateThreadScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [message, setMessage] = useState('');

  return (
    <ScrollView
      style={styles.backgroundPurple}
      contentContainerStyle={local.container}
    >
      {/* Header */}
      <View style={local.header}>
        <Pressable onPress={() => router.push('/forum')}>
          <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
        </Pressable>
      </View>

      {/* Input Box */}
      <View style={local.inputBox}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#999"
          style={local.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Title description"
          placeholderTextColor="#999"
          style={local.input}
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          placeholder="Message"
          placeholderTextColor="#999"
          style={[local.input, local.textArea]}
          multiline
          value={message}
          onChangeText={setMessage}
        />
      </View>

      {/* Post Button */}
      <Pressable style={local.postBtn} onPress={() => {router.push('/forum')}}>
        <Text style={local.postText}>Post</Text>
      </Pressable>
    </ScrollView>
  );
}

const local = StyleSheet.create({
  container: {
    padding: BOX_PADDING,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  inputBox: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#f39c12',
    borderRadius: 16,
    padding: BOX_PADDING,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#1a0f3f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    marginBottom: 0,
  },
  postBtn: {
    backgroundColor: '#0d6efd',
    width: BOX_WIDTH,
    alignSelf: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
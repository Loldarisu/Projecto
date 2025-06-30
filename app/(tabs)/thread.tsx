import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from '../custom/js/styles';

const messagesData = [
  {
    id: '1',
    user: 'Samot_PCW',
    avatar: require('../custom/imgs/user/blue.png'),
    time: '9 min',
    content: `Hey everyone!\n\nI'm looking to trade some of my rare holo cards...`,
  },
  {
    id: '2',
    user: 'Craneology',
    avatar: require('../custom/imgs/user/blue.png'),
    time: '5 min',
    content: `Hey!\n\nI could trade with you if you want`,
  },
];

export default function ThreadScreen() {
  const router = useRouter();
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [banModal, setBanModal] = useState(false);
  const [banTime, setBanTime] = useState('');
  const [banError, setBanError] = useState('');
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const handleSend = () => {
    if (!newMsg.trim()) {
      setError('Message cannot be empty');
      setTimeout(() => setError(''), 1000);
      return;
    }
    setError('');
    setNewMsg('');
  };

  const confirmDeleteThread = () => {
    setDeleteModal(false);
    router.replace('../(tabs)/forum');
  };

  const handleBanConfirm = () => {
    const dt = new Date(banTime);
    if (dt <= new Date()) {
      setBanError('Ban time must be in the future');
      setTimeout(() => setBanError(''), 1000);
      return;
    }
    setBanError('');
    setBanModal(false);
    Alert.alert('User has been banned');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#11045a' }}>
      <ScrollView contentContainerStyle={local.container}>
        <View style={[local.header, {marginTop: 40, marginBottom: 40}]}>
          <Pressable onPress={() => router.push('./forum')}>
            <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
          </Pressable>
        </View>

        <View style={local.threadBox}>
          {messagesData.map(msg => (
            <View key={msg.id} style={local.msgContainer}>
              <View style={local.msgHeader}>
                <Image source={msg.avatar} style={local.avatar} />
                <Text style={local.msgMeta}>{`${msg.user} • ${msg.time}`}</Text>
                <Pressable
                  style={local.menuBtn}
                  onPress={() =>
                    setMenuVisibleId(menuVisibleId === msg.id ? null : msg.id)
                  }
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </Pressable>
                {menuVisibleId === msg.id && (
                  <View style={local.menu}>
                    <Pressable
                      onPress={() => {
                        setMenuVisibleId(null);
                        router.push('../(tabs)/view-profile');
                      }}
                    >
                      <Text style={local.menuItem}>View Profile</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setMenuVisibleId(null);
                        router.push('../(tabs)/build-trade');
                      }}
                    >
                      <Text style={local.menuItem}>Trade</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setMenuVisibleId(null);
                        setBanModal(true);
                      }}
                    >
                      <Text style={local.menuItem}>Ban</Text>
                    </Pressable>
                  </View>
                )}
              </View>
              <View style={local.msgBubble}>
                <Text style={local.msgText}>{msg.content}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={local.sendLabel}>Type your message</Text>
        <TextInput
          placeholder="Start typing here..."
          placeholderTextColor="#666"
          value={newMsg}
          onChangeText={setNewMsg}
          style={[styles.input, { color: '#fff' }]}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable style={local.sendBtn} onPress={handleSend}>
          <Text style={local.sendText}>Send</Text>
        </Pressable>

        <Pressable
          style={local.deleteThreadBtn}
          onPress={() => setDeleteModal(true)}
        >
          <Text style={local.deleteThreadText}>Delete Thread</Text>
        </Pressable>
      </ScrollView>

      <Modal transparent visible={deleteModal} animationType="fade">
        <View style={local.overlay}>
          <View style={local.modal}>
            <Text style={local.modalTitle}>
              Are you sure you want to delete this thread?
            </Text>
            <View style={local.modalBtns}>
              <Pressable style={local.cancelBtn} onPress={() => setDeleteModal(false)}>
                <Text style={local.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={local.deleteBtnModal}
                onPress={confirmDeleteThread}
              >
                <Text style={local.deleteModalText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={banModal} animationType="fade">
        <View style={local.overlay}>
          <View style={local.modal}>
            <Text style={local.modalTitle}>Ban User</Text>
            <TextInput
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor="#666"
              value={banTime}
              onChangeText={setBanTime}
              style={[styles.input, { color: '#fff' }]}
            />
            {banError ? <Text style={styles.errorText}>{banError}</Text> : null}
            <View style={local.modalBtns}>
              <Pressable style={local.cancelBtnLeft} onPress={() => setBanModal(false)}>
                <Text style={local.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={local.saveBtnRight} onPress={handleBanConfirm}>
                <Text style={local.saveText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const local = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  header: { marginBottom: 12 },
  threadBox: {
    backgroundColor: '#120437',
    borderRadius: 16,
    padding: 16,
    margin: 8,
  },
  msgContainer: { marginBottom: 16 },
  msgHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  msgMeta: { color: '#fff', fontWeight: '600', flex: 1 },
  menuBtn: { padding: 4 },
  menu: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#11045a',
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 10,
    zIndex: 1000,
  },
  menuItem: { color: '#fff', paddingVertical: 8, paddingHorizontal: 12 },
  msgBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  msgText: { color: '#000', lineHeight: 20 },
  sendLabel: { color: '#fff', marginLeft: 20, marginBottom: 4 },
  sendBtn: {
    backgroundColor: '#0d6efd',
    margin: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontSize: 16 },
  deleteThreadBtn: {
    backgroundColor: '#dc3545',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteThreadText: { color: '#fff', fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: { backgroundColor: '#11045a', borderRadius: 12, padding: 20, width: '80%' },
  modalTitle: { color: '#fff', fontSize: 16, marginBottom: 12 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { marginRight: 12 },
  cancelBtnLeft: { marginRight: 12 },
  cancelText: { color: '#0d6efd', fontSize: 16 },
  deleteBtnModal: { backgroundColor: '#dc3545', padding: 10, borderRadius: 8 },
  deleteModalText: { color: '#fff', fontSize: 16 },
  saveBtnRight: { backgroundColor: '#0d6efd', padding: 10, borderRadius: 8 },
  saveText: { color: '#fff', fontSize: 16 },
});
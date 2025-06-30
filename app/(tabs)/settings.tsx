import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const ROW_HEIGHT = 56;
const HORIZONTAL_PADDING = 16;
const AVATAR_SIZE = 60;

export default function SettingsScreen() {
  const router = useRouter();

  // Avatar state
  const [avatar, setAvatar] = useState(require('../custom/imgs/user/black.png'));
  const [avatarDropdown, setAvatarDropdown] = useState(false);

  // Modal visibility
  const [nameModal, setNameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Form state
  const [newValue, setNewValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Validation and success
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Avatar options
  const avatarOptions = [
    require('../custom/imgs/user/black.png'),
    require('../custom/imgs/user/blue.png'),
    require('../custom/imgs/user/green.png'),
    require('../custom/imgs/user/purple.png'),
  ];

  // Close all modals
  const closeAll = () => {
    setNameModal(false);
    setEmailModal(false);
    setPasswordModal(false);
    setNotifModal(false);
    setDeleteModal(false);
    setAvatarDropdown(false);
    setNewValue('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  // Generic save for name/email
  const handleSaveGeneric = () => {
    if (!newValue.trim()) {
      setError('Field is required.');
      return;
    }
    if (
      emailModal &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)
    ) {
      setError('Invalid email address.');
      return;
    }
    setError('');
    setSuccess('Changes applied successfully');
    setTimeout(closeAll, 2000);
  };

  // Save for password modal
  const handleSavePassword = () => {
    if (!password) {
      setError('Current password is required.');
      return;
    }
    if (!newValue || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (newValue !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSuccess('Changes applied successfully');
    setTimeout(closeAll, 2000);
  };

  // Confirm delete account
  const handleDeleteAccount = () => {
    if (!password) {
      setError('Password is required.');
      return;
    }
    router.replace('./login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={[styles.header, {marginTop: 10, marginBottom: 60}]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#0d6efd" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      {/* User Row with Avatar Dropdown */}
      <View style={styles.userRow}>
        <Text style={styles.username}>Player Name</Text>
        <Pressable onPress={() => setAvatarDropdown(true)}>
          <Image source={avatar} style={styles.avatar} />
        </Pressable>
      </View>

      <Modal transparent visible={avatarDropdown} animationType="fade">
        <Pressable
          style={modalStyles.overlay}
          onPress={() => setAvatarDropdown(false)}
        >
          <View style={modalStyles.avatarContainer}>
            {avatarOptions.map((src, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setAvatar(src);
                  setAvatarDropdown(false);
                }}
              >
                <Image source={src} style={modalStyles.avatarOption} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Options */}
      <Pressable
        style={styles.optionRow}
        onPress={() => setNameModal(true)}
      >
        <Text style={styles.optionText}>Change Name</Text>
        <Ionicons name="pencil-outline" size={20} color="#333" />
      </Pressable>

      <Pressable
        style={styles.optionRow}
        onPress={() => setEmailModal(true)}
      >
        <Text style={styles.optionText}>Change Email</Text>
        <Ionicons name="pencil-outline" size={20} color="#333" />
      </Pressable>

      <Pressable
        style={styles.optionRow}
        onPress={() => setPasswordModal(true)}
      >
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="pencil-outline" size={20} color="#333" />
      </Pressable>

      <Pressable
        style={styles.optionRow}
        onPress={() => setNotifModal(true)}
      >
        <Text style={styles.optionText}>Notifications</Text>
        <Ionicons name="pencil-outline" size={20} color="#333" />
      </Pressable>

      {/* Sign Out & Delete */}
      <Pressable
        style={styles.signOutButton}
        onPress={() => router.replace('./login')}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
      <Pressable
        style={[styles.deleteButton, { backgroundColor: '#dc3545' }]}
        onPress={() => setDeleteModal(true)}
      >
        <Text style={[styles.deleteText, { color: '#fff' }]}>
          Delete Account
        </Text>
      </Pressable>

      {/* Modals */}
      {/* Generic Modal: Name / Email */}
      <Modal transparent visible={nameModal || emailModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.modalTitle}>
              {nameModal
                ? 'Change Name'
                : emailModal
                ? 'Change Email'
                : ''}
            </Text>
            <TextInput
              placeholder={
                nameModal ? 'New Name' : emailModal ? 'New Email' : ''
              }
              placeholderTextColor="#666"
              value={newValue}
              onChangeText={setNewValue}
              style={modalStyles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={modalStyles.input}
            />
            {error ? <Text style={modalStyles.error}>{error}</Text> : null}
            {success ? (
              <Text style={modalStyles.success}>{success}</Text>
            ) : null}
            <View style={modalStyles.buttonRow}>
              <Pressable
                style={modalStyles.cancelBtn}
                onPress={closeAll}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={modalStyles.saveBtn}
                onPress={handleSaveGeneric}
              >
                <Text style={modalStyles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal transparent visible={passwordModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="Current Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={modalStyles.input}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#666"
              value={newValue}
              onChangeText={setNewValue}
              secureTextEntry
              style={modalStyles.input}
            />
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={modalStyles.input}
            />
            {error ? <Text style={modalStyles.error}>{error}</Text> : null}
            {success ? (
              <Text style={modalStyles.success}>{success}</Text>
            ) : null}
            <View style={modalStyles.buttonRow}>
              <Pressable
                style={modalStyles.cancelBtn}
                onPress={closeAll}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={modalStyles.saveBtn}
                onPress={handleSavePassword}
              >
                <Text style={modalStyles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal transparent visible={notifModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.modalTitle}>Notifications</Text>
            <View style={modalStyles.switchRow}>
              <Text style={modalStyles.switchLabel}>
                Activate notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
            <View style={modalStyles.buttonRow}>
              <Pressable
                style={modalStyles.cancelBtn}
                onPress={closeAll}
              >
                <Text style={modalStyles.cancelText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal transparent visible={deleteModal} animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.modalTitle}>
              Confirm Delete Account
            </Text>
            <TextInput
              placeholder="Insert your password to confirm"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={modalStyles.input}
            />
            {error ? <Text style={modalStyles.error}>{error}</Text> : null}
            <View style={modalStyles.buttonRow}>
              <Pressable
                style={modalStyles.cancelBtn}
                onPress={closeAll}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[modalStyles.saveBtn, { backgroundColor: '#dc3545' }]}
                onPress={handleDeleteAccount}
              >
                <Text style={modalStyles.saveText}>
                  Delete Account
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#11045a',
        paddingTop: 40,
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 20,
    },
    header: { marginBottom: 16 },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    backText: {
        color: '#0d6efd',
        fontSize: 18,
        marginLeft: 4,
        fontWeight: '500',
    },
    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    username: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '500' },
    avatar: { width: 100, height: 100, borderRadius: 58, backgroundColor: '#ccc' },
    optionRow: {
        height: ROW_HEIGHT,
        backgroundColor: '#d3d3d3',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    optionText: { flex: 1, fontSize: 16, color: '#333' },
    signOutButton: {
        marginTop: 24,
        backgroundColor: '#0d6efd',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    deleteButton: {
        marginTop: 16,
        backgroundColor: '#dc3545',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modal: {
        width: '100%',
        backgroundColor: '#11045a',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#fff',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        color: '#000',
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
    cancelBtn: { paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
    cancelText: { fontSize: 16, color: '#555' },
    saveBtn: {
        backgroundColor: '#0d6efd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    saveText: { color: '#fff', fontSize: 16 },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: { fontSize: 16, color: '#fff' },
    error: { color: '#dc3545', marginBottom: 8 },
    success: { color: '#28a745', marginBottom: 8 },
    avatarContainer: {
        flexDirection: 'row',
        backgroundColor: '#11045a',
        padding: 16,
        borderRadius: 12,
    },
    avatarOption: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginHorizontal: 8,
    },
});
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../utils/supabase'; // ← your supabase client
import styles from './custom/js/styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; pass?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // same field validation
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email.';
    if (!pass1 || !pass2) newErrors.pass = 'Both password fields are required.';
    else if (pass1 !== pass2) newErrors.pass = 'Passwords do not match.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // supabase sign up
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass1,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Registration error', error.message);
    } else {
      // no session until email is confirmed
      Alert.alert(
        'Check your inbox',
        'A verification link has been sent to your email.'
      );
      // optionally redirect to a "verification" screen
      router.replace('/login');
    }
  };

  return (
    <View style={[styles.containerCenter, { paddingHorizontal: 20, paddingTop: 40 }]}>
      <Image
        source={require('./custom/imgs/menu/logo_s.png')}
        style={styles.smallLogo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, errors.name && styles.inputError]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, errors.email && styles.inputError]}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pass1}
        onChangeText={setPass1}
        style={[styles.input, errors.pass && styles.inputError]}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={pass2}
        onChangeText={setPass2}
        style={[styles.input, errors.pass && styles.inputError]}
      />
      {errors.pass && <Text style={styles.errorText}>{errors.pass}</Text>}

      <Pressable
        style={[styles.primaryButton, loading && { opacity: 0.6 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </Pressable>
    </View>
  );
}
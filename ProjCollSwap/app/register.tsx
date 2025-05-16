import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../utils/supabase';
import styles from './custom/js/styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    pass?: string;
  }>({});

  const handleSignUp = async () => {
    // 1) client-side validation (unchanged)
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Invalid email.';
    if (!pass1 || !pass2) newErrors.pass = 'Both password fields are required.';
    else if (pass1 !== pass2) newErrors.pass = 'Passwords do not match.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 2) sign up with Supabase Auth
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password: pass1,
      });

    if (signUpError) {
      Alert.alert(signUpError.message);
      return;
    }

    // 3) if no session (user must verify by email), inform them
    if (!signUpData.session) {
      Alert.alert('Please check your inbox for email verification!');
    }

    // 4) now insert a row in your `users` table linking auth_id → your bigint `id`
    //    note: supabase.auth.signUp returns `signUpData.user.id` as a UUID
    const authId = signUpData.user?.id;
    if (authId) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: authId,
          email,
          username: name,
          // everything else will take its DEFAULT:
          //   is_verified: false,
          //   reset_password_code: null,
          //   ban_until: null,
          //   is_banned: false,
          //   image_url: null,
          //   user_type: 'default'
        });
      if (insertError) {
        console.error('Failed to insert user row:', insertError);
      }
    }

    // 5) navigate to your existing register-success screen
    router.push('//register-success');
  };

  return (
    <View
      style={[
        styles.containerCenter,
        styles.backgroundPurple,
        { paddingHorizontal: 20, paddingTop: 40 },
      ]}
    >
      <Image
        source={require('./custom/imgs/menu/logo_s.png')}
        style={styles.smallLogo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, styles.inputBackground, errors.name && styles.inputError]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, styles.inputBackground, errors.email && styles.inputError]}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        value={pass1}
        onChangeText={setPass1}
        secureTextEntry
        style={[styles.input, styles.inputBackground, errors.pass && styles.inputError]}
      />
      <TextInput
        placeholder="Confirm Password"
        value={pass2}
        onChangeText={setPass2}
        secureTextEntry
        style={[styles.input, styles.inputBackground, errors.pass && styles.inputError]}
      />
      {errors.pass && <Text style={styles.errorText}>{errors.pass}</Text>}

      <Pressable style={styles.primaryButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </Pressable>
    </View>
  );
}
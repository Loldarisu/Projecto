import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../utils/supabase';
import styles from './custom/js/styles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    // 1) client-side validation (unchanged)
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Invalid email.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 2) sign in via Supabase Auth
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      Alert.alert(signInError.message);
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      Alert.alert('Could not get user ID from session.');
      return;
    }

    // 3) fetch the user’s row in your `users` table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();

    if (profileError) {
      console.error('Error loading user profile:', profileError);
      // still route onward if you wish...
    }

    // 4) everything is good → go to your tabs/index
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.containerCenter, styles.backgroundPurple, { paddingTop: 60 }]}>
      <View style={styles.formContainer}>
        <Image
          source={require('./custom/imgs/menu/logo_m.png')}
          style={styles.mediumLogo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, styles.inputBackground, errors.email && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, styles.inputBackground, errors.password && styles.inputError]}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/forgot-password')}>
          <Text style={styles.linkText}>Forgot password</Text>
        </Pressable>

        <Text>OR</Text>
        <Text style={styles.subtitle}>Connect with</Text>
        <Pressable>
          <Image
            source={require('./custom/imgs/menu/googleicon.png')}
          />
        </Pressable>

        <Text style={styles.subtitle}>
          Don’t have Account?{' '}
          <Text style={styles.linkText} onPress={() => router.push('/register')}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}
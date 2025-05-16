import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import styles from './custom/js/styles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.replace('/validation');
    }
  };

  return (
    <View style={[styles.containerSuc, styles.backgroundPurple, { paddingTop: 60 }]}>
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
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, styles.inputBackground, errors.password && styles.inputError]}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        <Link href="/forgot-password" asChild>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Link>
        <View style={styles.dividerContainer}>
          <Image
            source={require('./custom/imgs/menu/googleicon.png')}
            style={styles.smallIcon}
          />
        </View>
        <Text style={styles.subtitle}>Don’t have an account?</Text>
        <Link href="/register" asChild>
          <Text style={styles.linkText}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}
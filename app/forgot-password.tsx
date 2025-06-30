import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import styles from './custom/js/styles';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleContinue = () => {
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
        } else {
            setError('');
            router.push('./validation-reset');
        }
    };

    return (
        <View style={[styles.containerSuc, styles.backgroundPurple, { paddingHorizontal: 20 }]}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>Enter your email to get a verification code</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, styles.inputBackground, error && styles.inputError]}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>

            <Pressable onPress={() => router.push('./login')}>
                <Text style={styles.linkText}>Back to Login</Text>
            </Pressable>
        </View>
    );
}
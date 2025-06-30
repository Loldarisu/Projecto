import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import styles from './custom/js/styles';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!pass1 || !pass2) {
            setError('Please fill in both fields.');
        } else if (pass1 !== pass2) {
            setError('Passwords do not match.');
        } else {
            setError('');
            router.push('./reset-success');
        }
    };

    return (
        <View style={[styles.containerSuc, styles.backgroundPurple, { paddingHorizontal: 20 }]}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Create a new password</Text>

            <TextInput
                placeholder="New Password"
                secureTextEntry
                value={pass1}
                onChangeText={setPass1}
                style={[styles.input, styles.inputBackground, error && styles.inputError]}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={pass2}
                onChangeText={setPass2}
                style={[styles.input, styles.inputBackground, error && styles.inputError]}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Back to Login</Text>
            </Pressable>
        </View>
    );
}
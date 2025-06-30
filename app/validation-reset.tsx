import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from './custom/js/styles';

const { width } = Dimensions.get('window');
const CURVE_HEIGHT = 100;

export default function ValidationScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');

    const handleContinue = () => {
        // you can insert code validation logic here
        router.replace('./reset-password'); // go to reset-password on success
    };

    const [resendMessage, setResendMessage] = useState('');
    const handleResend = () => {
        // (insert your actual resend email logic here)
        setResendMessage('Code has been re-sent to your email');
        setTimeout(() => setResendMessage(''), 3000);
    };


    return (
        <View style={[styles.containerSuc, styles.welcomeBackground]}>
            {/* Header & Back */}
            <Stack.Screen options={{ headerShown: false }} />
            <View style={local.header}>
                <Pressable onPress={() => router.push('/login')}>
                    <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Cancel'}</Text>
                </Pressable>
            </View>

            {/* Logo */}
            <Image
                source={require('./custom/imgs/menu/logo_l.png')}
                style={local.logo}
                contentFit="contain"
            />

            {/* Title & Subtitle */}
            <Text style={local.title}>Authorization</Text>
            <Text style={local.subtitle}>
                An email has been sent to you with{'\n'}the validation code, verify to login
            </Text>

            {/* Prompt */}
            <Text style={local.prompt}>Enter the validation code</Text>

            {/* Input */}
            <TextInput
                placeholder="Number enter"
                placeholderTextColor="#666"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={local.input}
            />

            {/* Continue Button */}
            <Pressable style={local.continueBtn} onPress={handleContinue}>
                <Text style={local.continueText}>Continue</Text>
            </Pressable>

            {/* Re-send Code Button */}
            <Pressable style={local.resendBtn} onPress={handleResend}>
                <Text style={local.resendText}>Re-send code</Text>
            </Pressable>
            {resendMessage ? (
                <Text style={local.resendMsg}>{resendMessage}</Text>
            ) : null}
        </View>
    );
}

const local = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11045a',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        alignSelf: 'flex-start',
        marginBottom: 80,
        paddingLeft: 4,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
        lineHeight: 20,
    },
    prompt: {
        fontSize: 18,
        color: '#999',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    continueBtn: {
        width: '100%',
        backgroundColor: '#4e6eff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 16,
    },
    continueText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resendBtn: {
        width: '100%',
        backgroundColor: '#4e6eff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    resendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }, resendMsg: {
        color: '#4ee86e',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
});
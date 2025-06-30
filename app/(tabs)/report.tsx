import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from '../custom/js/styles';

export default function ReportPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ title: '', message: '' });
    const [success, setSuccess] = useState(false);

    const handleSend = () => {
        const newErrors = { title: '', message: '' };
        if (!title) newErrors.title = 'Title is required.';
        if (!message) newErrors.message = 'Message is required.';
        setErrors(newErrors);

        if (!newErrors.title && !newErrors.message) {
            setTitle('');
            setMessage('');
            setSuccess(true);

            // Hide message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } else {
            setSuccess(false);
        }
    };

    return (
        <ScrollView
            style={styles.backgroundPurple}
            contentContainerStyle={styles.screenContainer}
        >
            {/* Header */}
            <View style={local.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={[styles.backText, { color: '#0d6efd' }]}>{'<- Back'}</Text>
                </Pressable>
            </View>

            {/* Title */}
            <Text style={local.pageTitle}>Report</Text>

            {/* Form */}
            <View style={local.formContainer}>
                <TextInput
                    placeholder="Title"
                    placeholderTextColor="#666"
                    value={title}
                    onChangeText={setTitle}
                    style={[local.input, errors.title && local.inputError]}
                />
                {errors.title ? (
                    <Text style={styles.errorText}>{errors.title}</Text>
                ) : null}

                <TextInput
                    placeholder="Message"
                    placeholderTextColor="#666"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    style={[local.input, local.textArea, errors.message && local.inputError]}
                />
                {errors.message ? (
                    <Text style={styles.errorText}>{errors.message}</Text>
                ) : null}
            </View>

            {/* Send Button */}
            <Pressable style={local.sendButton} onPress={handleSend}>
                <Text style={local.sendButtonText}>Send Report</Text>
            </Pressable>

            {/* Success Message */}
            {success && (
                <Text style={{ color: '#28a745', marginTop: 16, fontSize: 16 }}>
                    Report successfully sent
                </Text>
            )}
        </ScrollView>
    );
}

const local = StyleSheet.create({
    header: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#120437',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f39c12',
    },
    input: {
        backgroundColor: '#11045a',
        color: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    textArea: {
        height: 300,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: '#dc3545',
    },
    sendButton: {
        backgroundColor: '#120437',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
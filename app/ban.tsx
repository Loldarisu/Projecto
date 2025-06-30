import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import correctImg from './custom/imgs/menu/correct.png';
import styles from './custom/js/styles';

export default function RegisterSuccessScreen() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('./login');
        }, 20000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.containerSuc}>
            <Text style={styles.topTextSuc}>Please come back after x days</Text>
            <Image source={correctImg} style={styles.bigCheckSuc} contentFit="contain" />
            <Text style={styles.bottomTextSuc}>Account has been banned</Text>
            <Pressable onPress={() => router.replace('./login')}>
                <Text style={styles.linkText}>Back to Login</Text>
            </Pressable>
        </View>

    );
}
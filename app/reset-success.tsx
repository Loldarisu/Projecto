import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import correctImg from './custom/imgs/menu/correct.png';
import styles from './custom/js/styles';

export default function ResetSuccessScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('./login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.containerSuc}>
      <Text style={styles.topTextSuc}>Password has been reset</Text>
      <Image source={correctImg} style={styles.bigCheckSuc} contentFit="contain" />
      <Text style={styles.bottomTextSuc}>Successfully</Text>
    </View>
  );
}
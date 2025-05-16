import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import correctImg from './custom/imgs/menu/correct.png';
import styles from './custom/js/styles';

export default function RegisterSuccessScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.containerSuc}>
      <Text style={styles.topTextSuc}>Account has been registered</Text>
      <Image source={correctImg} style={styles.bigCheckSuc} resizeMode="contain" />
      <Text style={styles.bottomTextSuc}>Successfully</Text>
    </View>
  );
}
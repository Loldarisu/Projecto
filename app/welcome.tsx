import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import styles from './custom/js/styles';


export default function WelcomeScreen() {
  return (
    <View style={[styles.containerSuc, styles.welcomeBackground]}>
      <Image
        source={require('./custom/imgs/menu/logo_l.png')}
        style={styles.largeLogo}
        contentFit="contain"
      />

      <View style={styles.welcomeTextGroup}>
        <Text style={styles.welcomeText}>Trade Cards</Text>
        <Text style={styles.welcomeText}>Earn Cards</Text>
        <Text style={styles.welcomeText}>And Enjoy</Text>
      </View>

      <Link href="./login" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.buttonText}>Welcome</Text>
        </Pressable>
      </Link>
    </View>
  );
}
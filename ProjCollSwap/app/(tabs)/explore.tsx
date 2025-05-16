import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../custom/js/styles';

export default function ExploreScreen() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = true; // Replace with actual auth logic
    if (!isLoggedIn) {
      router.replace('/login' as Href);
    }
  }, [router]);

  return (
    <View style={[styles.containerCenter, styles.backgroundPurple, { paddingTop: 40 }]}>
      <Pressable
        style={{ position: 'absolute', top: 40, left: 20 }}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>{'<- back'}</Text>
      </Pressable>

      <Text style={[styles.title, { color: '#fff' }]}>Explore</Text>
      {/* Add your explore screen content here */}
    </View>
  );
}
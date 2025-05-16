import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import styles from '../custom/js/styles';

import abilitiesImg from '../custom/imgs/menu/abilitiesmode.png';
import classicImg from '../custom/imgs/menu/classicmode.png';
import splashImg from '../custom/imgs/menu/splashartmode.png';

const { width } = Dimensions.get('window');

// we'll give each image a fixed width/height
const IMAGE_SIZE = width * 0.4;
// bubble will take the rest
const BUBBLE_WIDTH = width * 0.5;

const data = [
    {
        key: 'classic',
        image: classicImg,
        description: `A game where you have to guess the character based on general clues.\nYou have multiple attempts, and with each wrong guess, you receive hints. The goal is to guess with as few attempts!`,
        route: '/classic-mode-warframe',
    },
    {
        key: 'abilities',
        image: abilitiesImg,
        description: `A game where you have to guess the character based on one of their abilities.\nYou will only see the icon of an ability, without any name or description. Can you recognize the champion just from that?`,
        route: '/abilities-mode-warframe',
    },
    {
        key: 'splashart',
        image: splashImg,
        description: `A game where you have to guess the character based on a part of their splash art.\nYou will only see a small cropped portion of the image. Can you recognize the champion just from this detail?`,
        route: '/splashart-mode-warframe',
    },
];

export default function GameModesScreen() {
    const router = useRouter();

    return (
        <View style={[styles.containerCenter, styles.backgroundPurple, { paddingTop: 40 }]}>
            {/* Header */}
            <View style={local.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={local.backText}>{'<- Back'}</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={local.content}>
                {data.map((mode) => (
                    <View key={mode.key} style={local.row}>
                        <Pressable onPress={() => router.push(mode.route as const)} style={local.imageWrapper}>
                            <Image source={mode.image} style={local.image} resizeMode="cover" />
                        </Pressable>
                        <View style={local.bubble}>
                            <Text style={local.bubbleText}>{mode.description}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const local = StyleSheet.create({
    header: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    backText: {
        color: '#0d6efd',
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    imageWrapper: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bubble: {
        width: BUBBLE_WIDTH,
        backgroundColor: '#11045a',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 20,
        padding: 16,
        justifyContent: 'center',
    },
    bubbleText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
});
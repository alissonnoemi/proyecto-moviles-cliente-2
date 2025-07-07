import { Text, View, TouchableOpacity, Animated, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { welcomeStyles as styles } from '../styles/WelcomeScreenStyles'

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const navigation = useNavigation<any>();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();

        const floatAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        );
        floatAnimation.start();

        return () => {
            pulseAnimation.stop();
            floatAnimation.stop();
        };
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const float = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    uri: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
                }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(33,150,243,0.95)', 'rgba(25,118,210,0.9)', 'rgba(21,101,192,0.95)']}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                <View style={styles.floatingElements}>
                    <Animated.View
                        style={[
                            styles.floatingIcon,
                            styles.icon1,
                            { transform: [{ rotate: spin }, { translateY: float }] }
                        ]}
                    >
                        <Ionicons name="storefront-outline" size={30} color="rgba(255,255,255,0.3)" />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.floatingIcon,
                            styles.icon2,
                            { transform: [{ scale: pulseAnim }] }
                        ]}
                    >
                        <Ionicons name="bulb-outline" size={25} color="rgba(255,255,255,0.4)" />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.floatingIcon,
                            styles.icon3,
                            { transform: [{ rotate: spin }] }
                        ]}
                    >
                        <Ionicons name="people-outline" size={28} color="rgba(255,255,255,0.25)" />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.floatingIcon,
                            styles.icon4,
                            { transform: [{ translateY: float }] }
                        ]}
                    >
                        <Ionicons name="card-outline" size={22} color="rgba(255,255,255,0.35)" />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.floatingIcon,
                            styles.icon5,
                            { transform: [{ scale: pulseAnim }] }
                        ]}
                    >
                        <Ionicons name="rocket-outline" size={24} color="rgba(255,255,255,0.3)" />
                    </Animated.View>
                </View>

                <View style={styles.content}>
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.logoBackground}>
                            <View style={styles.logoContent}>
                                <View style={styles.rocketWrapper}>
                                    <Ionicons name="rocket" size={50} color="#FFFFFF" />
                                </View>
                                <View style={styles.chartWrapper}>
                                    <View style={styles.chartLine}>
                                        <View style={styles.chartPoint1} />
                                        <View style={styles.chartPoint2} />
                                        <View style={styles.chartPoint3} />
                                    </View>
                                    <Ionicons name="trending-up" size={32} color="#FFFFFF" style={styles.arrowIcon} />
                                </View>
                            </View>
                        </View>
                        <Animated.View
                            style={[
                                styles.logoRing,
                                { transform: [{ rotate: spin }] }
                            ]}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.titleContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.mainTitle}>StartUps</Text>
                        <Text style={styles.subtitle}>Descubre • Conecta • Compra</Text>
                        <Text style={styles.description}>
                            Encuentra los mejores emprendimientos, explora servicios únicos y conecta directamente con innovadores locales
                        </Text>
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.featuresContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.feature}>
                            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.featureText}>Explorar</Text>
                        </View>
                        <View style={styles.feature}>
                            <Ionicons name="storefront-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.featureText}>Emprendimientos</Text>
                        </View>
                        <View style={styles.feature}>
                            <Ionicons name="bag-check-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.featureText}>Adquirir</Text>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.statsContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>500+</Text>
                            <Text style={styles.statLabel}>Emprendimientos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>1K+</Text>
                            <Text style={styles.statLabel}>Servicios</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>24/7</Text>
                            <Text style={styles.statLabel}>Disponible</Text>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.buttonContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F8F9FA']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.buttonText}>Explorar Emprendimientos</Text>
                                <Ionicons name="arrow-forward" size={20} color="#1565C0" style={styles.buttonIcon} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Animated.View
                    style={[
                        styles.bottomIndicators,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={styles.indicatorDot} />
                    <View style={[styles.indicatorDot, styles.activeDot]} />
                    <View style={styles.indicatorDot} />
                </Animated.View>
            </ImageBackground>
        </View>
    )
}

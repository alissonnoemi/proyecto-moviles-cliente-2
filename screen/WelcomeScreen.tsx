import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingElements: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingIcon: {
        position: 'absolute',
        padding: 15,
    },
    icon1: {
        top: 80,
        left: 20,
    },
    icon2: {
        top: 150,
        right: 30,
    },
    icon3: {
        bottom: 200,
        left: 15,
    },
    icon4: {
        bottom: 250,
        right: 40,
    },
    icon5: {
        top: 200,
        left: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBackground: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#2196F3', 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 15,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoContent: {
        position: 'relative',
        width: 100,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rocketWrapper: {
        position: 'absolute',
        top: 0,
        left: 10,
        zIndex: 2,
    },
    chartWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
    },
    chartLine: {
        position: 'absolute',
        bottom: 15,
        right: 35,
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: 30,
        height: 15,
    },
    chartPoint1: {
        width: 3,
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginRight: 2,
    },
    chartPoint2: {
        width: 3,
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginRight: 2,
    },
    chartPoint3: {
        width: 3,
        height: 15,
        backgroundColor: '#FFFFFF',
    },
    arrowIcon: {
        position: 'absolute',
        bottom: -5,
        right: 0,
    },
    rocketContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartIcon: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderRadius: 15,
        padding: 5,
    },
    logoRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    mainTitle: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        letterSpacing: 3,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: 18,
        fontWeight: '600',
        letterSpacing: 1.5,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 15,
        fontWeight: '400',
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 35,
        paddingHorizontal: 10,
    },
    feature: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 18,
        paddingHorizontal: 22,
        borderRadius: 25,
        minWidth: 85,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    featureText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    stat: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        marginBottom: 15,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
    },
    buttonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 35,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1565C0',
        marginRight: 10,
    },
    buttonIcon: {
        marginLeft: 5,
    },
    secondaryButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    secondaryButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    bottomIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
        gap: 10,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    activeDot: {
        backgroundColor: '#FFFFFF',
        width: 28,
        borderRadius: 14,
    },
})

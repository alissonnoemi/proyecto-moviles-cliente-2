import { Text, View, ImageBackground, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { loginStyles as styles } from '../styles/LoginScreenStyles'

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = () => {
        navigation.navigate('LoginForm');
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'
                }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                <Animated.View
                    style={[
                        styles.titleContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.title}>StartUps</Text>
                    <Text style={styles.subtitle}>Tu futuro comienza aquí</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.registerButtonText}>Registrarte</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ImageBackground>
        </View>
    )
}
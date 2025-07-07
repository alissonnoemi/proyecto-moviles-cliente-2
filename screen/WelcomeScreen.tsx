import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
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

    // Animación de pulso continua
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

    return () => pulseAnimation.stop();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,122,255,0.8)', 'rgba(88,86,214,0.9)', 'rgba(255,45,85,0.8)']}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Elementos decorativos flotantes */}
        <View style={styles.floatingElements}>
          <Animated.View 
            style={[
              styles.floatingCircle, 
              styles.circle1,
              { transform: [{ rotate: spin }] }
            ]}
          />
          <Animated.View 
            style={[
              styles.floatingCircle, 
              styles.circle2,
              { transform: [{ scale: pulseAnim }] }
            ]}
          />
          <Animated.View 
            style={[
              styles.floatingCircle, 
              styles.circle3,
              { transform: [{ rotate: spin }] }
            ]}
          />
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Logo/Icono principal */}
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
              <Ionicons name="rocket" size={60} color="#FFFFFF" />
            </View>
            <View style={styles.logoRing} />
          </Animated.View>

          {/* Título principal */}
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
            <Text style={styles.subtitle}>Innovación • Crecimiento • Éxito</Text>
            <Text style={styles.description}>
              Descubre un mundo de oportunidades ilimitadas y construye el futuro que siempre soñaste
            </Text>
          </Animated.View>

          {/* Características */}
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
              <Ionicons name="trending-up" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Crecimiento</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="people" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Comunidad</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="bulb" size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Innovación</Text>
            </View>
          </Animated.View>

          {/* Botón de acción */}
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
                <Text style={styles.buttonText}>Comenzar Aventura</Text>
                <Ionicons name="arrow-forward" size={20} color="#5856D6" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Explorar sin registro</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Indicadores en la parte inferior */}
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
  floatingCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: 100,
    left: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 200,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: 150,
    left: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 80,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5856D6',
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
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
    borderRadius: 12,
  },
})
import { StyleSheet } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screen/WelcomeScreen';
import Screen1 from '../screen/Screen1';
import LoginScreen from '../screen/LoginScreen';
import InicioSesionScreen from '../screen/InicioSesionScreen';
import RegistroScreen from '../screen/RegistroScreen';
import { createStackNavigator } from '@react-navigation/stack';
import PerfilScreen from '../screen/PerfilScreen';
import ReseniaScreen from '../screen/ReseniaScreen';
import SolicitudScreen from '../screen/SolicitudScreen';
import HistorialSolicitudScreen from '../screen/HistorialSolicitudScreen';
import HistorialReseniasScreen from '../screen/HistorialReseniasScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='LoginForm' component={InicioSesionScreen} />
            <Stack.Screen name='Reseña' component={ReseniaScreen} />
            <Stack.Screen name='Register' component={RegistroScreen} />
            <Stack.Screen
                name='Solicitud'
                component={SolicitudScreen}
                options={{
                    headerShown: true,
                    title: 'Solicitud de Servicio',
                    headerStyle: {
                        backgroundColor: '#4CAF50',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen name="Main" component={MyDrawer} />
        </Stack.Navigator>
    )
}

function MyTabs() {
    return (
        <Tab.Navigator 
            initialRouteName="Welcome" 
            screenOptions={{ 
                headerShown: false,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingBottom: 5,
                    paddingTop: 5,
                }
            }}
        >
            <Tab.Screen 
                name="Welcome" 
                component={WelcomeScreen}
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Screen1" 
                component={Screen1} 
                options={{ 
                    title: 'Emprendimientos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="business" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function MyDrawer() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: true }}>
            <Drawer.Screen name="Tabs" component={MyTabs} options={{ title: 'Inicio' }} />
            <Drawer.Screen name="Perfil" component={PerfilScreen} />
            <Drawer.Screen name="Historial Solicitudes" component={HistorialSolicitudScreen} options={{ title: 'Historial Pedidos' }} />
            <Drawer.Screen name='Historial Reseñas' component={HistorialReseniasScreen} options={{ title: 'Todas las Reseñas' }} />
        </Drawer.Navigator>
    )
}

export default function MainNavigation() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})
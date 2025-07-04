import { StyleSheet } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screen/WelcomeScreen';
import Screen1 from '../screen/Screen1';
import Screen2 from '../screen/Screen2';
import LoginScreen from '../screen/LoginScreen';
import InicioSesionScreen from '../screen/InicioSesionScreen';
import RegistroScreen from '../screen/RegistroScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Screen1">
            <Tab.Screen name="Screen1" component={Screen1} options={{ title: 'Emprendimientos' }} />
            <Tab.Screen name="Screen2" component={Screen2} options={{ title: 'Servicios' }} />
        </Tab.Navigator>
    );
}

function MyDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Welcome">
            <Drawer.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Bienvenida' }} />
            <Drawer.Screen name="Login" component={LoginScreen} options={{ title: 'Acceder' }} />
            <Drawer.Screen name="LoginForm" component={InicioSesionScreen} options={{ title: 'Iniciar Sesión' }} />
            <Drawer.Screen name="Register" component={RegistroScreen} options={{ title: 'Registrarse' }} />
            <Drawer.Screen name="Main" component={MyTabs} options={{ title: 'Inicio' }} />
        </Drawer.Navigator>
    );
}

export default function MainNavigation() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})
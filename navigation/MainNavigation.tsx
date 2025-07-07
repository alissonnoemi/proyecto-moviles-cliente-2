import { StyleSheet } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../screen/WelcomeScreen';
import Screen1 from '../screen/Screen1';
import Screen2 from '../screen/Screen2';
import LoginScreen from '../screen/LoginScreen';
import LoginFormScreen from '../screen/LoginFormScreen';
import RegisterScreen from '../screen/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Screen1">
            <Tab.Screen 
                name="Screen1" 
                component={Screen1}
                options={{ title: 'Pantalla 1' }}
            />
            <Tab.Screen 
                name="Screen2" 
                component={Screen2}
                options={{ title: 'Pantalla 2' }}
            />
        </Tab.Navigator>
    );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Welcome">
            <Drawer.Screen 
                name="Welcome"
                component={WelcomeScreen}
                options={{ title: 'Bienvenida' }}
            />
            <Drawer.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ title: 'Acceder' }}
            />
            <Drawer.Screen 
                name="LoginForm" 
                component={LoginFormScreen}
                options={{ title: 'Iniciar Sesión', headerShown: false }}
            />
            <Drawer.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ title: 'Registrarse', headerShown: false }}
            />
            <Drawer.Screen 
                name="Tabs" 
                component={MyTabs}
                options={{ title: 'Inicio' }}
            />
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
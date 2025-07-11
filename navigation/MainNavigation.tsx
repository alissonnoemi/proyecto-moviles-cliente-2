import { StyleSheet } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
;
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screen/WelcomeScreen';
import Screen1 from '../screen/Screen1';
import Screen2 from '../screen/Screen2';
import LoginScreen from '../screen/LoginScreen';
import InicioSesionScreen from '../screen/InicioSesionScreen';
import RegistroScreen from '../screen/RegistroScreen';
import { createStackNavigator } from '@react-navigation/stack';
import PerfilScreen from '../screen/PerfilScreen';
import ReseniaScreen from '../screen/ReseniaScreen';
import SolicitudScreen from '../screen/SolicitudScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); 3

function MyStack() {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='LoginForm' component={InicioSesionScreen} />
            <Stack.Screen name='Register' component={RegistroScreen} />
            <Stack.Screen name="Tabs" component={MyTabs} />
        </Stack.Navigator>
    )
}

function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Welcome" >
            <Tab.Screen name="Welcome" component={WelcomeScreen} />
            <Tab.Screen name="Screen1" component={Screen1} options={{ title: 'Emprendimientos' }} />
            <Tab.Screen name="Screen2" component={Screen2} options={{ title: 'Servicios' }} />
            <Tab.Screen name='Drawer' component={MyDrawer} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
function MyDrawer() {
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="Perfil" component={PerfilScreen} />
            <Drawer.Screen name="Resenia" component={ReseniaScreen} />
            <Drawer.Screen name="Solicitud" component={SolicitudScreen} />
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
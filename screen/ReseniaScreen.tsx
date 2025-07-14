import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
interface Resenia {
    id: string;
    nombre: string;
    descripcion: string;
    calificacion: number;
    nombre_servicio: string;
}
export default function ReseniaScreen() {
    const ruta = useRoute<any>();
    const navigation = useNavigation<any>();
    const servicio = ruta.params?.servicio
    const serviciosDisponibles = ruta.params?.servicios || []
    const [datos, setdatos] = useState({
        id: '',
        nombre: '',
        descripcion: '',
        calificacion: 0,
        nombre_servicio: ''
    })
   

        return (
            <View>
                <Text>ReseniaScreen</Text>
            </View>
        )

    }


    const styles = StyleSheet.create({})
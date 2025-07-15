import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    StyleSheet
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../supabase/Config'
import { ref, set, get } from "firebase/database"
import { database } from '../firebase/Config'

export default function ReseniaScreen() {
    const ruta = useRoute<any>()
    const navegacion = useNavigation<any>()
    const servicio: any = ruta.params?.servicio

    const [datosResenia, setDatosResenia] = useState<any>({
        id: '',
        nombre: '',
        mensaje: '',
        calificacion: 0,
        nombre_servicio: servicio?.nombre || ''
    })

    const [cargando, setCargando] = useState<boolean>(false)

    useEffect(() => {
        cargarDatosUsuario()
    }, [])

    const cargarDatosUsuario = async () => {
        try {
            const { data: { user: usuario } }: any = await supabase.auth.getUser()

            if (!usuario) {
                Alert.alert('Error', 'Usuario no autenticado')
                navegacion.goBack()
                return
            }

            const { data: clienteData, error }: any = await supabase
                .from('cliente')
                .select('nombre_completo')
                .eq('uid', usuario.id)
                .single()

            if (error) {
                console.error('Error obteniendo datos del cliente:', error)
                Alert.alert('Error', 'No se pudo cargar la información del cliente')
                navegacion.goBack()
            } else {
                setDatosResenia((prev: any) => ({
                    ...prev,
                    nombre: clienteData.nombre_completo || ''
                }))
            }
        } catch (error: any) {
            console.error('Error:', error)
            Alert.alert('Error', 'Ocurrió un error inesperado')
            navegacion.goBack()
        }
    }

    const actualizarCampo = (campo: any, valor: any) => {
        setDatosResenia((prev: any) => ({
            ...prev,
            [campo]: valor
        }))
    }

    const seleccionarCalificacion = (calificacion: any) => {
        setDatosResenia((prev: any) => ({
            ...prev,
            calificacion: calificacion
        }))
    }

    const escribirResenia = async (idResenia: any, nombre: any, mensaje: any, calificacion: any, nombreServicio: any) => {
        try {
            await set(ref(database, 'resenias/' + idResenia), {
                id: idResenia,
                nombre: nombre,
                mensaje: mensaje,
                calificacion: calificacion,
                nombre_servicio: nombreServicio,
                fecha: new Date().toISOString(),
                servicio_id: servicio?.id_servicio || null
            })
            return true
        } catch (error) {
            console.error('Error escribiendo reseña:', error)
            throw error
        }
    }

    const enviarResenia = async () => {
        // Validaciones
        if (!datosResenia.id.trim()) {
            Alert.alert('Error', 'Por favor ingresa un ID para la reseña')
            return
        }

        if (!datosResenia.mensaje.trim()) {
            Alert.alert('Error', 'Por favor escribe un mensaje')
            return
        }

        if (datosResenia.calificacion === 0) {
            Alert.alert('Error', 'Por favor selecciona una calificación')
            return
        }
        setCargando(true)
        try {
            const reseniaRef: any = ref(database, 'resenias/' + datosResenia.id)
            const snapshot: any = await get(reseniaRef)

            if (snapshot.exists()) {
                Alert.alert('Error', 'Ya existe una reseña con este ID. Por favor usa otro ID.')
                setCargando(false)
                return
            }
            // Guardar la reseña
            await escribirResenia(
                datosResenia.id,
                datosResenia.nombre,
                datosResenia.mensaje,
                datosResenia.calificacion,
                datosResenia.nombre_servicio
            )

            Alert.alert(
                'Reseña Enviada',
                'Tu reseña ha sido enviada exitosamente. ¡Gracias por tu opinión!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpiar formulario
                            setDatosResenia({
                                id: '',
                                nombre: datosResenia.nombre,
                                mensaje: '',
                                calificacion: 0,
                                nombre_servicio: datosResenia.nombre_servicio
                            })
                            navegacion.goBack()
                        }
                    }
                ]
            )

        } catch (error: any) {
            console.error('Error enviando reseña:', error)
            Alert.alert('Error', 'No se pudo enviar la reseña. Intenta nuevamente.')
        } finally {
            setCargando(false)
        }
    }

    const renderizarEstrellas = () => {
        const estrellas: any[] = []
        for (let i = 1; i <= 5; i++) {
            estrellas.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => seleccionarCalificacion(i)}
                    style={styles.estrella}
                >
                    <Ionicons
                        name={i <= datosResenia.calificacion ? "star" : "star-outline"}
                        size={30}
                        color={i <= datosResenia.calificacion ? "#FFD700" : "#ccc"}
                    />
                </TouchableOpacity>
            )
        }
        return estrellas
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navegacion.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Escribir Reseña</Text>
            </View>

            <View style={styles.formularioContainer}>
                <Text style={styles.tituloFormulario}>¿Cómo fue tu experiencia?</Text>

                <View style={styles.servicioInfo}>
                    <Text style={styles.servicioLabel}>Servicio:</Text>
                    <Text style={styles.servicioNombre}>{datosResenia.nombre_servicio}</Text>
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.etiquetaCampo}>ID de Reseña *</Text>
                    <TextInput
                        style={styles.campoTexto}
                        value={datosResenia.id}
                        onChangeText={(valor: any) => actualizarCampo('id', valor)}
                        placeholder="Ingresa un ID único para tu reseña (ej: resenia_001)"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.etiquetaCampo}>Tu Nombre</Text>
                    <TextInput
                        style={[styles.campoTexto, styles.campoSoloLectura]}
                        value={datosResenia.nombre}
                        editable={false}
                        placeholder="Cargando nombre..."
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.etiquetaCampo}>Tu Reseña *</Text>
                    <TextInput
                        style={[styles.campoTexto, styles.areaTexto]}
                        value={datosResenia.mensaje}
                        onChangeText={(valor: any) => actualizarCampo('mensaje', valor)}
                        placeholder="Comparte tu experiencia con este servicio..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.etiquetaCampo}>Calificación *</Text>
                    <View style={styles.estrellasContainer}>
                        {renderizarEstrellas()}
                    </View>
                    <Text style={styles.textoCalificacion}>
                        {datosResenia.calificacion > 0 ? `${datosResenia.calificacion} de 5 estrellas` : 'Selecciona una calificación'}
                    </Text>
                </View>

                <View style={styles.botonesContainer}>
                    <TouchableOpacity
                        style={styles.botonCancelar}
                        onPress={() => navegacion.goBack()}
                    >
                        <Text style={styles.textoBotonCancelar}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botonEnviar, cargando && styles.botonDeshabilitado]}
                        onPress={enviarResenia}
                        disabled={cargando}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.textoBotonEnviar}>
                            {cargando ? 'Enviando...' : 'Enviar Reseña'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    botonVolver: {
        padding: 5,
        marginRight: 15,
    },
    headerTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    formularioContainer: {
        padding: 20,
    },
    tituloFormulario: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    servicioInfo: {
        backgroundColor: '#e8f5e8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    servicioLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    servicioNombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 5,
    },
    campoContainer: {
        marginBottom: 20,
    },
    etiquetaCampo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    campoTexto: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
    },
    campoSoloLectura: {
        backgroundColor: '#f8f9fa',
        color: '#666',
    },
    areaTexto: {
        height: 100,
        textAlignVertical: 'top',
    },
    estrellasContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    estrella: {
        marginHorizontal: 5,
        padding: 5,
    },
    textoCalificacion: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    botonCancelar: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    textoBotonCancelar: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    botonEnviar: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    botonDeshabilitado: {
        backgroundColor: '#ccc',
    },
    textoBotonEnviar: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
})
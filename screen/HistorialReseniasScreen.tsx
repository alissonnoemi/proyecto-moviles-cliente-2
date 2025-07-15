import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ref, onValue, off } from "firebase/database"
import { database } from '../firebase/Config'

interface Resenia {
    id: string
    nombre: string
    mensaje: string
    calificacion: number
    nombre_servicio: string
    fecha: string
    servicio_id: number | null
}

export default function HistorialReseniasScreen() {
    const [resenias, setResenias] = useState<Resenia[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        cargarResenias()

        return () => {
            // Limpiar listener cuando el componente se desmonte
            const reseniasRef = ref(database, 'resenias')
            off(reseniasRef)
        }
    }, [])

    const cargarResenias = () => {
        try {
            const reseniasRef = ref(database, 'resenias')

            onValue(reseniasRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    const reseniasArray = Object.values(data) as Resenia[]
                    // Ordenar por fecha (más recientes primero)
                    reseniasArray.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    setResenias(reseniasArray)
                } else {
                    setResenias([])
                }
                setLoading(false)
                setRefreshing(false)
            })
        } catch (error) {
            console.error('Error cargando reseñas:', error)
            Alert.alert('Error', 'No se pudieron cargar las reseñas')
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        cargarResenias()
    }

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const renderEstrellas = (calificacion: number) => {
        const estrellas = []
        for (let i = 1; i <= 5; i++) {
            estrellas.push(
                <Ionicons
                    key={i}
                    name={i <= calificacion ? "star" : "star-outline"}
                    size={16}
                    color={i <= calificacion ? "#FFD700" : "#ccc"}
                />
            )
        }
        return estrellas
    }

    const renderResenia = ({ item }: { item: Resenia }) => (
        <View style={styles.reseniaCard}>
            <View style={styles.reseniaHeader}>
                <View style={styles.usuarioInfo}>
                    <Text style={styles.nombreUsuario}>{item.nombre}</Text>
                    <View style={styles.estrellasContainer}>
                        {renderEstrellas(item.calificacion)}
                        <Text style={styles.calificacionTexto}>({item.calificacion}/5)</Text>
                    </View>
                </View>
                <Text style={styles.fechaTexto}>{formatearFecha(item.fecha)}</Text>
            </View>

            <View style={styles.servicioInfo}>
                <Text style={styles.servicioNombre}>Servicio: {item.nombre_servicio}</Text>
            </View>

            <View style={styles.mensajeContainer}>
                <Text style={styles.mensajeTexto}>{item.mensaje}</Text>
            </View>
        </View>
    )

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay reseñas</Text>
            <Text style={styles.emptySubtitle}>Aún no se han enviado reseñas</Text>
        </View>
    )

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.botonVolver}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#4CAF50" />
                <Text style={styles.textoVolver}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Todas las Reseñas</Text>
            <Text style={styles.headerSubtitle}>
                {resenias.length} reseña{resenias.length !== 1 ? 's' : ''}
            </Text>
        </View>
    )

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="hourglass-outline" size={50} color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando reseñas...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={resenias}
                renderItem={renderResenia}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4CAF50']}
                        tintColor="#4CAF50"
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
    },
    headerContainer: {
        marginBottom: 20,
    },
    botonVolver: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    textoVolver: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    reseniaCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reseniaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    usuarioInfo: {
        flex: 1,
    },
    nombreUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    estrellasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calificacionTexto: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    fechaTexto: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    servicioInfo: {
        marginBottom: 12,
    },
    servicioNombre: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
    },
    mensajeContainer: {
        marginBottom: 12,
    },
    mensajeTexto: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    reseniaFooter: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    reseniaId: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 18,
        color: '#4CAF50',
        marginTop: 16,
    },
})
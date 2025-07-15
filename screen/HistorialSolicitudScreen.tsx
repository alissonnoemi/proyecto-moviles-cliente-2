import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../supabase/Config'
import { useNavigation } from '@react-navigation/native'
import { historialStyles as styles } from '../styles/HistorialSolicitudStyles'

interface Solicitud {
    id_solicitud: number
    id_servicio: number
    estado: string
    total: number
    cantidad: number
    fecha_solicitud: string
    servicio_nombre: string
    servicio_descripcion: string
    servicio_precio: number
    emprendimiento_nombre: string
    emprendimiento_categoria: string
    servicio: any
}

export default function HistorialSolicitudScreen() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation<any>()

    useEffect(() => {
        cargarSolicitudes()
    }, [solicitudes])

    const cargarSolicitudes = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                Alert.alert('Error', 'Usuario no autenticado')
                return
            }
            const { data: solicitudesData, error: solicitudesError } = await supabase
                .from('solicitud')
                .select('*')
                .eq('uid_cliente', user.id)
                .order('id_solicitud', { ascending: false })

            if (solicitudesError) {
                console.error('Error cargando solicitudes:', solicitudesError)
                Alert.alert('Error', 'No se pudieron cargar las solicitudes')
                return
            }

            if (!solicitudesData || solicitudesData.length === 0) {
                setSolicitudes([])
                setLoading(false)
                setRefreshing(false)
                return
            }

            const servicioIds = solicitudesData.map(s => s.id_servicio)
            const { data: serviciosData, error: serviciosError } = await supabase
                .from('servicio')
                .select('*')
                .in('id_servicio', servicioIds)

            if (serviciosError) {
                console.error('Error cargando servicios:', serviciosError)
                Alert.alert('Error', 'No se pudieron cargar los servicios')
                return
            }

            const emprendimientoRucs = serviciosData?.map(s => s.ruc_emprendimiento) || []
            const { data: emprendimientosData, error: emprendimientosError } = await supabase
                .from('emprendimiento')
                .select('*')
                .in('ruc', emprendimientoRucs)

            if (emprendimientosError) {
                console.error('Error cargando emprendimientos:', emprendimientosError)
            }

            const solicitudesCompletas = solicitudesData.map(solicitud => {
                const servicio = serviciosData?.find(s => s.id_servicio === solicitud.id_servicio)
                const emprendimiento = emprendimientosData?.find(e => e.ruc === servicio?.ruc_emprendimiento)

                return {
                    id_solicitud: solicitud.id_solicitud,
                    id_servicio: solicitud.id_servicio,
                    estado: solicitud.estado,
                    total: solicitud.total,
                    cantidad: solicitud.cantidad,
                    fecha_solicitud: `Solicitud #${solicitud.id_solicitud}`,
                    servicio_nombre: servicio?.nombre || 'Servicio no encontrado',
                    servicio_descripcion: servicio?.descripcion || 'Sin descripción',
                    servicio_precio: servicio?.precio || 0,
                    emprendimiento_nombre: emprendimiento?.nombre_emprendimiento || 'Emprendimiento no encontrado',
                    emprendimiento_categoria: emprendimiento?.categoria || 'Sin categoría',
                    servicio: servicio
                }
            })

            setSolicitudes(solicitudesCompletas)

        } catch (error) {
            console.error('Error:', error)
            Alert.alert('Error', 'Ocurrió un error inesperado')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        cargarSolicitudes()
    }

    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'solicitado': return '#FFA500'
            case 'aprobado': return '#4CAF50'
            case 'rechazado': return '#FF6B6B'
            default: return '#666'
        }
    }

    const getEstadoIcono = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'solicitado': return 'time-outline'
            case 'aprobado': return 'checkmark-circle'
            case 'rechazado': return 'close-circle'
            default: return 'help-circle'
        }
    }

    const navegarAResenia = (servicio: any) => {
        if (!servicio) {
            Alert.alert('Error', 'No se pudo obtener la información del servicio')
            return
        }
        navigation.navigate('Reseña', { servicio })
    }

    const navegarAHistorialResenias = () => {
        navigation.navigate('Historial Reseñas')
    }

    const renderSolicitud = ({ item }: { item: Solicitud }) => (
        <View style={styles.solicitudCard}>
            <View style={styles.solicitudHeader}>
                <View style={styles.emprendimientoInfo}>
                    <Text style={styles.emprendimientoNombre}>
                        {item.emprendimiento_nombre}
                    </Text>
                    <Text style={styles.emprendimientoCategoria}>
                        {item.emprendimiento_categoria}
                    </Text>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
                    <Ionicons name={getEstadoIcono(item.estado) as any} size={16} color="#fff" />
                    <Text style={styles.estadoTexto}>{item.estado.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.servicioInfo}>
                <Text style={styles.servicioNombre}>{item.servicio_nombre}</Text>
                <Text style={styles.servicioDescripcion}>{item.servicio_descripcion}</Text>
            </View>

            <View style={styles.detallesContainer}>
                <View style={styles.detalleItem}>
                    <Ionicons name="receipt-outline" size={16} color="#666" />
                    <Text style={styles.detalleTexto}>Solicitud #{item.id_solicitud}</Text>
                </View>

                <View style={styles.detalleItem}>
                    <Ionicons name="cube-outline" size={16} color="#666" />
                    <Text style={styles.detalleTexto}>Cantidad: {item.cantidad}</Text>
                </View>
            </View>

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalMonto}>${item.total}</Text>
            </View>
            <TouchableOpacity
                style={styles.botonResenia}
                onPress={() => navegarAResenia(item.servicio)}
            >
                <Ionicons name="star-outline" size={20} color="#4CAF50" />
                <Text style={styles.textoBotonResenia}>Escribir Reseña</Text>
            </TouchableOpacity>
        </View>
    )

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay solicitudes</Text>
            <Text style={styles.emptySubtitle}>Aún no has realizado ninguna solicitud</Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Screen1')}
            >
                <Text style={styles.emptyButtonText}>Explorar Emprendimientos</Text>
            </TouchableOpacity>
        </View>
    )

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Historial de Solicitudes</Text>
            <Text style={styles.headerSubtitle}>
                {solicitudes.length} solicitud{solicitudes.length !== 1 ? 'es' : ''}
            </Text>
            
            <TouchableOpacity
                style={styles.botonVerResenias}
                onPress={navegarAHistorialResenias}
            >
                <Ionicons name="star" size={20} color="#fff" />
                <Text style={styles.textoBotonVerResenias}>Ver Todas las Reseñas</Text>
            </TouchableOpacity>
        </View>
    )

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="hourglass-outline" size={50} color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando solicitudes...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={solicitudes}
                renderItem={renderSolicitud}
                keyExtractor={(item) => item.id_solicitud.toString()}
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
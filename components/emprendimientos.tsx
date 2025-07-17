import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/Config'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface Emprendimiento {
    ruc: string;
    uid_emprendedor: string;
    nombre_emprendimiento: string;
    categoria: string;
    foto_emprendedor?: string;
    descripcion: string;
}

interface emprendedores {
    foto: string;
    uid: string;
}

export default function Emprendimientos() {
    const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState<Emprendimiento | null>(null)
    const [servicios, setServicios] = useState<any[]>([])
    const navigation = useNavigation<any>()
    const [emprendedores, setEmprendedores] = useState<emprendedores[]>([])

    useEffect(() => {
        leerEmprendimientos()
    }, [])

    async function leerEmprendimientos() {
        try {
            // Obtener emprendimientos
            const { data: emprendimientosData, error: emprendimientosError } = await supabase
                .from('emprendimiento')
                .select('ruc, uid_emprendedor, nombre_emprendimiento, categoria, descripcion')
                .order('nombre_emprendimiento', { ascending: true })

            if (emprendimientosError) {
                console.error('Error obteniendo emprendimientos:', emprendimientosError)
                return
            }

            // Obtener fotos de emprendedores
            const uidsEmprendedores = emprendimientosData?.map(emp => emp.uid_emprendedor) || []
            let emprendedoresData: any[] = []

            if (uidsEmprendedores.length > 0) {
                const { data, error: emprendedoresError } = await supabase
                    .from('emprendedor')
                    .select('uid, foto')
                    .in('uid', uidsEmprendedores)

                if (emprendedoresError) {
                    console.error('Error obteniendo fotos de emprendedores:', emprendedoresError)
                } else {
                    emprendedoresData = data || []
                    setEmprendedores(emprendedoresData)
                }
            }

            // Combinar datos de emprendimientos con fotos
            const emprendimientosConFotos = emprendimientosData?.map(emprendimiento => {
                const emprendedor = emprendedoresData.find(emp => emp.uid === emprendimiento.uid_emprendedor)
                return {
                    ...emprendimiento,
                    foto_emprendedor: emprendedor?.foto || null
                }
            }) || []

            setEmprendimientos(emprendimientosConFotos)
        } catch (error) {
            console.error('Error general:', error)
        }
    }

    async function obtenerServicios(ruc: string) {
        const { data, error } = await supabase
            .from('servicio')
            .select('*')
            .eq('ruc_emprendimiento', ruc)

        if (error) {
            console.error('Error obteniendo servicios:', error)
        } else {
            setServicios(data || [])
        }
    }

    function abrirModal(emprendimiento: Emprendimiento) {
        setEmprendimientoSeleccionado(emprendimiento)
        obtenerServicios(emprendimiento.ruc)
        setModalVisible(true)
    }

    function cerrarModal() {
        setModalVisible(false)
        setEmprendimientoSeleccionado(null)
        setServicios([])
    }

    function irASolicitud(emprendimiento: Emprendimiento, servicios: any[]) {
        navigation.navigate('Solicitud', {
            emprendimiento: {
                ruc: emprendimiento.ruc,
                name: emprendimiento.nombre_emprendimiento,
                category: emprendimiento.categoria,
                rating: 4.5,
                description: `Emprendimiento de ${emprendimiento.categoria}`
            },
            servicios: servicios
        })
        cerrarModal()
    }

    function getCategoriaIcon(categoria: string) {
        switch (categoria.toLowerCase()) {
            case 'comida':
                return <Ionicons name="fast-food" size={18} color="#FF9800" style={{ marginRight: 5 }} />;
            case 'belleza':
                return <MaterialCommunityIcons name="face-woman" size={18} color="#E91E63" style={{ marginRight: 5 }} />;
            case 'ropa':
                return <Ionicons name="shirt" size={18} color="#3F51B5" style={{ marginRight: 5 }} />;
            case 'tecnología':
                return <Ionicons name="laptop" size={18} color="#009688" style={{ marginRight: 5 }} />;
            default:
                return <Ionicons name="pricetag" size={18} color="#607D8B" style={{ marginRight: 5 }} />;
        }
    }

    function renderEmprendimiento({ item }: { item: Emprendimiento }) {
        const getInitials = (name: string) => {
            if (!name) return 'E'
            const parts = name.split(' ')
            return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase()
        }

        return (
            <TouchableOpacity
                style={styles.emprendimientoItem}
                onPress={() => abrirModal(item)}
            >
                <View style={styles.emprendimientoContainer}>
                    <View style={styles.avatarContainer}>
                        {item.foto_emprendedor ? (
                            <Image 
                                source={{ uri: item.foto_emprendedor }} 
                                style={styles.avatarImage}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {getInitials(item.nombre_emprendimiento)}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.emprendimientoInfo}>
                        <Text style={styles.nombreEmprendimiento}>{item.nombre_emprendimiento}</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle" size={16} color="#4CAF50" style={{ marginRight: 4 }} />
                            <Text style={styles.categoriaDescripcion}>{item.descripcion}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            {getCategoriaIcon(item.categoria)}
                            <Text style={styles.categoriaEmprendimiento}>{item.categoria}</Text>
                        </View>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#666" />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emprendimientos Disponibles</Text>

            {emprendimientos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay emprendimientos registrados</Text>
                </View>
            ) : (
                <FlatList
                    data={emprendimientos}
                    renderItem={renderEmprendimiento}
                    keyExtractor={(item) => item.ruc}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {emprendimientoSeleccionado?.nombre_emprendimiento}
                        </Text>

                        {emprendimientoSeleccionado && (
                            <View style={styles.detallesContainer}>
                                <View style={styles.detalleItem}>
                                    <Text style={styles.detalleLabel}>CATEGORÍA:</Text>
                                    <Text style={styles.detalleValor}>{emprendimientoSeleccionado.categoria}</Text>
                                </View>
                                <Text style={styles.serviciosTitle}>Servicios Disponibles:</Text>
                                {servicios.length === 0 ? (
                                    <Text style={styles.noServiciosText}>No hay servicios disponibles</Text>
                                ) : (
                                    <View style={styles.serviciosContainer}>
                                        {servicios.slice(0, 3).map((servicio) => (
                                            <View key={servicio.id_servicio} style={styles.servicioItem}>
                                                <View style={styles.servicioInfo}>
                                                    <Text style={styles.nombreServicio}>{servicio.nombre}</Text>
                                                    <Text style={styles.descripcionServicio}>{servicio.descripcion}</Text>
                                                </View>
                                                <View style={styles.precioContainer}>
                                                    <Text style={styles.precioServicio}>${servicio.precio}</Text>
                                                </View>
                                            </View>
                                        ))}
                                        {servicios.length > 3 && (
                                            <Text style={styles.masServiciosText}>
                                                +{servicios.length - 3} servicios más
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={cerrarModal}>
                                <Text style={styles.cancelButtonText}>Cerrar</Text>
                            </TouchableOpacity>

                            {servicios.length > 0 && (
                                <TouchableOpacity
                                    style={styles.solicitudButton}
                                    onPress={() => irASolicitud(emprendimientoSeleccionado!, servicios)}
                                >
                                    <Text style={styles.solicitudButtonText}>Hacer Solicitud</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf6f6',
        padding: 20,
    },
    title: {
        fontSize: 28, 
        fontWeight: 'bold',
        color: '#1e3c72',
        textAlign: 'center',
        marginBottom: 28,
        letterSpacing: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 22, 
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    listContainer: {
        paddingBottom: 30,
    },
    emprendimientoItem: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#1e3c72',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    emprendimientoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 18,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1e3c72',
    },
    avatarText: {
        color: '#fff',
        fontSize: 26, 
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    emprendimientoInfo: {
        flex: 1,
    },
    nombreEmprendimiento: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#1e3c72',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    categoriaDescripcion: {
        fontSize: 18,
        fontWeight:'semibold', 
        color: '#666',
        marginBottom: 0,
        flexShrink: 1,
    },
    categoriaEmprendimiento: {
        fontSize: 18, // antes 15
        color: '#4CAF50',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30,60,114,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        margin: 20,
        maxHeight: '85%',
        minWidth: 320,
        shadowColor: '#1e3c72',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    modalTitle: {
        fontSize: 28, // antes 24
        fontWeight: 'bold',
        color: '#1e3c72',
        textAlign: 'center',
        marginBottom: 22,
        letterSpacing: 1,
    },
    detallesContainer: {
        marginBottom: 18,
    },
    detalleItem: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    detalleLabel: {
        fontSize: 18, // antes 15
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 3,
        letterSpacing: 0.5,
    },
    detalleValor: {
        fontSize: 20, // antes 17
        color: '#1e3c72',
        fontWeight: '500',
    },
    serviciosTitle: {
        fontSize: 22, // antes 18
        fontWeight: 'bold',
        color: '#1e3c72',
        marginBottom: 12,
        marginTop: 12,
        letterSpacing: 0.5,
    },
    noServiciosText: {
        fontSize: 18, // antes 15
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    serviciosContainer: {
        maxHeight: 200,
    },
    servicioItem: {
        backgroundColor: '#eaf6f6',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    servicioInfo: {
        flex: 1,
    },
    nombreServicio: {
        fontSize: 19, // antes 16
        fontWeight: '700',
        color: '#1e3c72',
        marginBottom: 2,
    },
    descripcionServicio: {
        fontSize: 16, // antes 14
        color: '#666',
    },
    precioContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 8,
    },
    precioServicio: {
        fontSize: 18, // antes 15
        fontWeight: 'bold',
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 14,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
        marginRight: 6,
    },
    cancelButtonText: {
        color: '#4CAF50',
        fontSize: 18, // antes 16
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    solicitudButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginLeft: 6,
        shadowColor: '#1e3c72',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
    },
    solicitudButtonText: {
        color: '#fff',
        fontSize: 18, // antes 16
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    masServiciosText: {
        fontSize: 17, // antes 15
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
})
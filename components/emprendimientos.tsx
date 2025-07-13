import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/Config'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface Emprendimiento {
    ruc: string;
    uid_emprendedor: string;
    nombre_emprendimiento: string;
    categoria: string;
}

export default function Emprendimientos() {
    const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState<Emprendimiento | null>(null)
    const [servicios, setServicios] = useState<any[]>([])
    const navigation = useNavigation<any>()

    useEffect(() => {
        leerEmprendimientos()
    }, [])

    async function leerEmprendimientos() {
        const { data, error } = await supabase
            .from('emprendimiento')
            .select('ruc, uid_emprendedor, nombre_emprendimiento, categoria')
            .order('nombre_emprendimiento', { ascending: true })

        if (error) {
            console.error('Error obteniendo emprendimientos:', error)
        } else {
            setEmprendimientos(data || [])
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

    function renderEmprendimiento({ item }: { item: Emprendimiento }) {
        return (
            <TouchableOpacity
                style={styles.emprendimientoItem}
                onPress={() => abrirModal(item)}
            >
                <View style={styles.emprendimientoInfo}>
                    <Text style={styles.nombreEmprendimiento}>{item.nombre_emprendimiento}</Text>
                    <Text style={styles.categoriaEmprendimiento}>{item.categoria}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
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
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    emprendimientoItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    emprendimientoInfo: {
        flex: 1,
    },
    nombreEmprendimiento: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    categoriaEmprendimiento: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    rucEmprendimiento: {
        fontSize: 12,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        margin: 20,
        maxHeight: '80%',
        minWidth: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    detallesContainer: {
        marginBottom: 20,
    },
    detalleItem: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detalleLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    detalleValor: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    serviciosTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
    },
    noServiciosText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    serviciosContainer: {
        maxHeight: 200,
    },
    servicioItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    servicioInfo: {
        flex: 1,
    },
    nombreServicio: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    descripcionServicio: {
        fontSize: 14,
        color: '#666',
    },
    precioContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    precioServicio: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    solicitudButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    solicitudButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    masServiciosText: {
        fontSize: 14,
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
    },
})
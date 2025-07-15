import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/Config'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { perfilStyles as styles } from '../styles/PerfilScreenStyles'
import * as ImagePicker from 'expo-image-picker';


export default function PerfilScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<any>(null)
    const [cliente, setCliente] = useState<any>(null)
    const [editingName, setEditingName] = useState(false)
    const [tempName, setTempName] = useState('')
    const navigation = useNavigation<any>()
    async function actualizar() {
        const avatarFile = image!
        const { data, error } = await supabase
            .storage
            .from('avatars')
            .update('public/avatar1.png', avatarFile, {
                cacheControl: '3600',
                upsert: true
            })
    }
    async function subir() {
        const avatarFile = image!
        const { data, error } = await supabase
            .storage
            .from('imagenes')
            .upload('public/avatar2.png', {
                uri: image,
                cacheControl: '3600',
                upsert: false
            } as any, {
                contentType: 'image/png'
            }
            )
        console.log(data, error)
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    useEffect(() => {
        obtenerDatosCompletos()
    }, [])

    async function obtenerDatosCompletos() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            console.log("Usuario obtenido:", user)
            console.log("ID del usuario autenticado:", user?.id)
            setUsuario(user)

            // Obtener cliente de la tabla
            if (user) {
                const { data: clienteData, error } = await supabase
                    .from('cliente')
                    .select('*')
                    .eq('uid', user.id)

                console.log("Buscando cliente con uid:", user.id)

                if (error) {
                    console.error('Error obteniendo cliente:', error)
                } else {
                    if (clienteData && clienteData.length > 0) {
                        setCliente(clienteData[0])
                        console.log("Cliente encontrado:", clienteData[0])
                    } else {
                        console.log("No se encontraron datos del cliente")
                        setCliente(null)
                    }
                }
            }
        } catch (error) {
            console.error('Error obteniendo datos:', error)
        }
    }

    async function cerrarSesion() {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sí, cerrar sesión",
                    style: "destructive",
                    onPress: async () => {
                        await supabase.auth.signOut()
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    }
                }
            ]
        )
    }

    const getInitials = (name: string) => {
        if (!name) return 'U'
        const names = name.split(' ')
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase()
        }
        return name[0].toUpperCase()
    }

    const handleEditName = () => {
        setTempName(cliente?.nombre_completo || usuario?.email?.split('@')[0] || '')
        setEditingName(true)
    }

    const handleSaveName = () => {
        if (cliente) {
            setCliente({
                ...cliente,
                nombre_completo: tempName
            })
        }
        setEditingName(false)
    }

    const handleCancelEdit = () => {
        setTempName('')
        setEditingName(false)
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#007AFF', '#0056CC']}
                style={styles.headerGradient}
            >
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity
                            style={styles.avatar}
                            onPress={pickImage}
                            activeOpacity={0.7}
                        >
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>
                                    {getInitials(cliente?.nombre_completo || usuario?.email || 'Usuario')}
                                </Text>
                            )}

                            <View style={styles.cameraOverlay}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>
                        {cliente?.nombre_completo || usuario?.email?.split('@')[0] || 'Usuario'}
                    </Text>

                    {image && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={subir}
                        >
                            <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
                            <Text style={styles.uploadButtonText}>Subir Foto</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                    <Text style={styles.statNumber}>
                        {new Date(usuario?.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </Text>
                    <Text style={styles.statLabel}>Miembro desde</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
                    <Text style={styles.statNumber}>Verificado</Text>
                    <Text style={styles.statLabel}>Estado</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="trophy-outline" size={24} color="#FF9500" />
                    <Text style={styles.statNumber}>Gold</Text>
                    <Text style={styles.statLabel}>Nivel</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Nombre Completo</Text>
                            {editingName ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        style={styles.editInput}
                                        value={tempName}
                                        onChangeText={setTempName}
                                        autoFocus={true}
                                        placeholder="Ingresa tu nombre"
                                    />
                                    <View style={styles.editButtons}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={handleCancelEdit}
                                        >
                                            <Ionicons name="close" size={16} color="#FF3B30" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            onPress={handleSaveName}
                                        >
                                            <Ionicons name="checkmark" size={16} color="#4CAF50" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleEditName}>
                                    <Text style={styles.infoValue}>
                                        {cliente?.nombre_completo || 'No especificado'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Correo Electrónico</Text>
                            <Text style={styles.infoValue}>{usuario?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="card-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Cédula</Text>
                            <Text style={styles.infoValue}>
                                {cliente?.cedula || 'No especificado'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="finger-print-outline" size={20} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>ID de Usuario</Text>
                            <Text style={styles.infoValueSmall}>{usuario?.id}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Acciones</Text>

                <TouchableOpacity style={styles.actionButton} onPress={handleEditName}>
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Editar Perfil</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { }}>
                    <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Ayuda y Soporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => { }}>
                    <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Acerca de</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
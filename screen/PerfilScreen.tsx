// Código completo refactorizado con layout completo y funcionalidades
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/Config'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { perfilStyles as styles } from '../styles/PerfilScreenStyles'
import * as ImagePicker from 'expo-image-picker'

export default function PerfilScreen() {
    const [image, setImage] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [usuario, setUsuario] = useState<any>(null)
    const [cliente, setCliente] = useState<any>(null)
    const [editingName, setEditingName] = useState(false)
    const [tempName, setTempName] = useState('')
    const navigation = useNavigation<any>()

    useEffect(() => {
        obtenerDatosCompletos()
    }, [])

    async function obtenerDatosCompletos() {
        setLoadingData(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            setUsuario(user)

            if (user) {
                const { data: clienteData, error } = await supabase
                    .from('cliente')
                    .select('*')
                    .eq('uid', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error('Error obteniendo datos del cliente:', error)
                    return
                }

                if (clienteData) {
                    setCliente(clienteData)
                    if (clienteData.imagen) {
                        // Verificar si la imagen es accesible
                        await verificarImagen(clienteData.imagen)
                    }
                }
            }
        } catch (error) {
            console.error('Error cargando perfil:', error)
            Alert.alert('Error', 'No se pudo cargar el perfil.')
        } finally {
            setLoadingData(false)
        }
    }

    async function verificarImagen(imageUrl: string) {
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' })
            if (response.ok) {
                setImage(imageUrl)
            } else {
                setImage(null)
            }
        } catch (error) {
            console.error('Error verificando imagen:', error)
            setImage(null)
        }
    }

    async function eliminarArchivosAnteriores() {
        try {
            const { data: files, error } = await supabase.storage.from('imagenes').list('public')
            if (error) {
                console.error('Error listando archivos:', error)
                return
            }

            const filesToDelete = files
                ?.filter(file => file.name.startsWith(`avatar_${usuario.id}`))
                ?.map(f => `public/${f.name}`)
            
            if (filesToDelete && filesToDelete.length > 0) {
                const { error: deleteError } = await supabase.storage.from('imagenes').remove(filesToDelete)
                if (deleteError) {
                    console.error('Error eliminando archivos:', deleteError)
                }
            }
        } catch (error) {
            console.error('Error eliminando archivos anteriores:', error)
        }
    }

    async function subirImagen() {
        if (!image || !usuario?.id) return Alert.alert('Error', 'Imagen o usuario inválido')

        setUploading(true)
        try {
            console.log('Iniciando subida de imagen...')
            
            // Eliminar archivos anteriores
            await eliminarArchivosAnteriores()

            // Usar FormData para React Native
            const formData = new FormData()
            const fileName = `avatar_${usuario.id}_${Date.now()}.jpg`
            
            formData.append('file', {
                uri: image,
                type: 'image/jpeg',
                name: fileName,
            } as any)

            const filePath = `public/${fileName}`

            // Subir usando FormData
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(filePath, formData, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Error de subida:', uploadError)
                throw new Error(`Error subiendo imagen: ${uploadError.message}`)
            }

            console.log('Imagen subida exitosamente:', uploadData)

            // Obtener URL pública
            const { data: urlData } = supabase.storage
                .from('imagenes')
                .getPublicUrl(filePath)

            const imageUrl = urlData?.publicUrl
            if (!imageUrl) {
                throw new Error('No se pudo obtener la URL pública')
            }

            console.log('URL obtenida:', imageUrl)

            // Actualizar base de datos
            const { error: dbError } = await supabase
                .from('cliente')
                .update({ imagen: imageUrl })
                .eq('uid', usuario.id)

            if (dbError) {
                console.error('Error actualizando BD:', dbError)
                throw new Error(`Error actualizando perfil: ${dbError.message}`)
            }

            console.log('BD actualizada exitosamente')

            // Actualizar estado local
            setImage(imageUrl)
            setCliente({ ...cliente, imagen: imageUrl })
            Alert.alert('Éxito', 'Foto actualizada correctamente.')

        } catch (error: any) {
            console.error('Error subiendo imagen:', error)
            Alert.alert('Error', error.message || 'No se pudo subir la imagen.')
        } finally {
            setUploading(false)
        }
    }

    async function eliminarFoto() {
        if (!usuario?.id) return

        Alert.alert('Eliminar Foto', '¿Seguro que deseas eliminar la imagen?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar', style: 'destructive', onPress: async () => {
                    try {
                        await eliminarArchivosAnteriores()
                        
                        const { error } = await supabase
                            .from('cliente')
                            .update({ imagen: null })
                            .eq('uid', usuario.id)
                        
                        if (error) {
                            throw error
                        }
                        
                        setImage(null)
                        setCliente({ ...cliente, imagen: null })
                        Alert.alert('Éxito', 'Foto eliminada.')
                    } catch (error: any) {
                        console.error('Error eliminando foto:', error)
                        Alert.alert('Error', 'No se pudo eliminar la imagen.')
                    }
                }
            }
        ])
    }

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri)
            }
        } catch (error) {
            console.error('Error seleccionando imagen:', error)
            Alert.alert('Error', 'No se pudo seleccionar la imagen.')
        }
    }

    const tomarFoto = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync()
            if (!permission.granted) {
                return Alert.alert('Permisos requeridos', 'Se requiere permiso de cámara.')
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri)
            }
        } catch (error) {
            console.error('Error tomando foto:', error)
            Alert.alert('Error', 'No se pudo tomar la foto.')
        }
    }

    const mostrarOpcionesImagen = () => {
        const opciones: Array<{
            text: string;
            onPress?: () => void;
            style?: 'default' | 'cancel' | 'destructive';
        }> = [
            { text: 'Seleccionar de galería', onPress: pickImage },
            { text: 'Tomar foto', onPress: tomarFoto },
            { text: 'Cancelar', style: 'cancel' }
        ]

        // Agregar opción de eliminar solo si hay imagen del servidor
        if (image && !image.startsWith('file://')) {
            opciones.splice(2, 0, {
                text: 'Eliminar foto actual',
                onPress: eliminarFoto,
                style: 'destructive'
            })
        }

        Alert.alert('Foto de perfil', 'Elige una opción', opciones)
    }

    const handleSaveName = async () => {
        if (!tempName.trim()) return Alert.alert('Error', 'El nombre no puede estar vacío.')
        
        try {
            const { error } = await supabase
                .from('cliente')
                .update({ nombre_completo: tempName.trim() })
                .eq('uid', usuario.id)

            if (error) {
                throw error
            }

            setCliente({ ...cliente, nombre_completo: tempName.trim() })
            setEditingName(false)
            Alert.alert('Éxito', 'Nombre actualizado')
        } catch (error: any) {
            console.error('Error actualizando nombre:', error)
            Alert.alert('Error', 'No se pudo actualizar el nombre.')
        }
    }

    const cerrarSesion = async () => {
        Alert.alert('Cerrar sesión', '¿Deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Salir', style: 'destructive', onPress: async () => {
                    try {
                        await supabase.auth.signOut()
                        navigation.replace('Login')
                    } catch (error) {
                        console.error('Error cerrando sesión:', error)
                        Alert.alert('Error', 'No se pudo cerrar la sesión.')
                    }
                }
            }
        ])
    }

    const getInitials = (name: string) => {
        if (!name) return 'U'
        const parts = name.split(' ')
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase()
    }

    if (loadingData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Cargando...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={["#007AFF", "#0056CC"]} style={styles.headerGradient}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={mostrarOpcionesImagen} style={styles.avatar}>
                            {image ? (
                                <Image 
                                    source={{ uri: image }} 
                                    style={styles.avatarImage}
                                    onError={() => setImage(null)}
                                />
                            ) : (
                                <Text style={styles.avatarText}>
                                    {getInitials(cliente?.nombre_completo || usuario?.email || 'Usuario')}
                                </Text>
                            )}
                            <View style={styles.cameraOverlay}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                    </View>

                    <Text style={styles.userName}>
                        {cliente?.nombre_completo || usuario?.email?.split('@')[0] || 'Usuario'}
                    </Text>

                    {image && image.startsWith('file://') && (
                        <TouchableOpacity 
                            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]} 
                            onPress={subirImagen} 
                            disabled={uploading}
                        >
                            <Ionicons 
                                name={uploading ? "hourglass-outline" : "cloud-upload-outline"} 
                                size={16} 
                                color="#fff" 
                            />
                            <Text style={styles.uploadButtonText}>
                                {uploading ? 'Subiendo...' : 'Subir Foto'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                    <Text style={styles.statNumber}>
                        {usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString() : 'N/A'}
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
                                        autoFocus
                                        placeholder="Ingresa tu nombre"
                                    />
                                    <View style={styles.editButtons}>
                                        <TouchableOpacity 
                                            style={styles.cancelButton} 
                                            onPress={() => setEditingName(false)}
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
                                <TouchableOpacity 
                                    onPress={() => { 
                                        setTempName(cliente?.nombre_completo || '')
                                        setEditingName(true) 
                                    }}
                                >
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
                            <Text style={styles.infoValue}>{cliente?.cedula || 'No especificado'}</Text>
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
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => {
                        setTempName(cliente?.nombre_completo || '')
                        setEditingName(true)
                    }}
                >
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Editar Perfil</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => Alert.alert('Ayuda', 'Funcionalidad de ayuda en desarrollo.')}
                >
                    <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Ayuda y Soporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => Alert.alert('Acerca de', 'Información en desarrollo.')}
                >
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

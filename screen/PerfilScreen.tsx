import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase/Config'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { perfilStyles as styles } from '../styles/PerfilScreenStyles'
import * as ImagePicker from 'expo-image-picker';

export default function PerfilScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [usuario, setUsuario] = useState<any>(null)
    const [cliente, setCliente] = useState<any>(null)
    const [editingName, setEditingName] = useState(false)
    const [tempName, setTempName] = useState('')
    const navigation = useNavigation<any>()

    useEffect(() => {
        console.log('=== USEEFFECT INICIADO ===')
        obtenerDatosCompletos()
    }, [])

    async function obtenerDatosCompletos() {
        console.log('=== INICIANDO obtenerDatosCompletos ===')
        setLoadingData(true);
        try {
            console.log('Step 1: Obteniendo usuario de Supabase...')
            const { data: { user } } = await supabase.auth.getUser()
            console.log("Step 1 COMPLETADO - Usuario obtenido:", user?.id)
            setUsuario(user)

            if (user) {
                console.log('Step 2: Obteniendo datos del cliente...')
                const { data: clienteData, error } = await supabase
                    .from('cliente')
                    .select('*')
                    .eq('uid', user.id)

                if (error) {
                    console.error('Step 2 ERROR - Error obteniendo cliente:', error)
                } else {
                    console.log('Step 2 COMPLETADO - Datos cliente obtenidos:', clienteData?.length)
                    if (clienteData && clienteData.length > 0) {
                        setCliente(clienteData[0])
                        console.log("Step 2.1 - Cliente encontrado:", clienteData[0].nombre_completo)
                        
                        // Si hay imagen en la BD, cargarla directamente
                        if (clienteData[0].imagen) {
                            console.log('Step 2.2 - Imagen encontrada en BD:', clienteData[0].imagen)
                            const urlConTimestamp = `${clienteData[0].imagen}?t=${Date.now()}`
                            setImage(urlConTimestamp)
                            console.log('Step 2.2 COMPLETADO - Imagen cargada desde BD')
                        } else {
                            console.log('Step 2.2 - No hay imagen en BD')
                        }
                    } else {
                        console.log("Step 2.1 - No se encontraron datos del cliente")
                        setCliente(null)
                    }
                }

                // Solo cargar desde storage si no hay imagen en BD
                if (!clienteData?.[0]?.imagen) {
                    console.log('Step 3: Iniciando carga desde storage...')
                    await cargarImagenPerfil(user.id)
                    console.log('Step 3 COMPLETADO - Carga desde storage finalizada')
                } else {
                    console.log('Step 3 OMITIDO - Ya hay imagen en BD')
                }
            } else {
                console.log('ERROR - No hay usuario autenticado')
            }
        } catch (generalError: any) { // CAMBIO: agregar tipo any
            console.error('=== ERROR EN obtenerDatosCompletos ===', generalError)
            console.error('Error tipo:', generalError?.constructor?.name)
            console.error('Error message:', generalError?.message)
            console.error('Error stack:', generalError?.stack)
            Alert.alert('Error', 'No se pudieron cargar los datos del perfil.')
        } finally {
            console.log('=== FINALIZANDO obtenerDatosCompletos ===')
            setLoadingData(false);
        }
    }

    // Función para cargar la imagen de perfil
    async function cargarImagenPerfil(userId: string) {
        console.log('=== INICIANDO cargarImagenPerfil ===')
        console.log('UserId recibido:', userId)
        try {
            console.log('Step A: Intentando cargar desde BD...')
            const { data: clienteData, error: clienteError } = await supabase
                .from('cliente')
                .select('imagen')
                .eq('uid', userId)
                .single()

            if (clienteError) {
                console.log('Step A ERROR:', clienteError)
            } else {
                console.log('Step A COMPLETADO - Datos obtenidos:', clienteData)
            }

            if (!clienteError && clienteData?.imagen) {
                console.log('Step B: Imagen encontrada en BD:', clienteData.imagen)
                
                try {
                    console.log('Step B.1: Verificando acceso a imagen...')
                    const response = await fetch(clienteData.imagen, { method: 'HEAD' })
                    console.log('Step B.1 - Response status:', response.status)
                    
                    if (response.ok) {
                        const urlConTimestamp = `${clienteData.imagen}?t=${Date.now()}`
                        setImage(urlConTimestamp)
                        console.log('Step B.1 COMPLETADO - Imagen cargada desde BD')
                        return
                    } else {
                        console.log('Step B.1 - Imagen no accesible, status:', response.status)
                        console.log('Step B.1.1 - Limpiando URL inválida de BD...')
                        
                        // CAMBIO: Limpiar URL inválida de BD
                        const { error: cleanError } = await supabase
                            .from('cliente')
                            .update({ imagen: null })
                            .eq('uid', userId)
                        
                        if (!cleanError) {
                            console.log('Step B.1.1 COMPLETADO - URL inválida eliminada de BD')
                        }
                    }
                } catch (fetchError) {
                    console.error('Step B.1 ERROR - Error verificando imagen:', fetchError)
                    console.log('Step B.1.1 - Limpiando URL inválida de BD...')
                    
                    // CAMBIO: Limpiar URL inválida de BD
                    await supabase
                        .from('cliente')
                        .update({ imagen: null })
                        .eq('uid', userId)
                }
            } else {
                console.log('Step B OMITIDO - No hay imagen en BD')
            }

            console.log('Step C: Buscando en storage...')
            const { data: files, error: listError } = await supabase
                .storage
                .from('imagenes')
                .list('public', { 
                    limit: 100,
                    offset: 0
                })

            if (listError) {
                console.error('Step C ERROR - Error listando archivos:', listError)
                return
            }

            console.log('Step C COMPLETADO - Archivos encontrados:', files?.length)
            console.log('Step C - Nombres de archivos:', files?.map(f => f.name))

            const avatarFiles = files?.filter(file =>
                file.name.startsWith(`avatar_${userId}`)
            ) || []

            console.log('Step D: Archivos de avatar filtrados:', avatarFiles.length)
            console.log('Step D - Archivos de avatar:', avatarFiles.map(f => f.name))

            if (avatarFiles.length > 0) {
                console.log('Step E: Procesando archivo de avatar...')
                const avatarFile = avatarFiles[0]
                console.log('Step E - Archivo seleccionado:', avatarFile.name)
                
                const { data: urlData } = await supabase
                    .storage
                    .from('imagenes')
                    .getPublicUrl(`public/${avatarFile.name}`)

                const imageUrl = urlData.publicUrl
                console.log('Step E - URL generada:', imageUrl)

                console.log('Step F: Actualizando BD con URL encontrada...')
                const { error: updateError } = await supabase
                    .from('cliente')
                    .update({ imagen: imageUrl })
                    .eq('uid', userId)

                if (updateError) {
                    console.error('Step F ERROR - Error actualizando BD:', updateError)
                } else {
                    console.log('Step F COMPLETADO - BD actualizada')
                }

                const urlConTimestamp = `${imageUrl}?t=${Date.now()}`
                setImage(urlConTimestamp)
                console.log('Step G COMPLETADO - Imagen cargada desde storage')
            } else {
                console.log('Step E OMITIDO - No se encontró imagen para este usuario')
            }

        } catch (generalError: any) { // CAMBIO: agregar tipo any
            console.error('=== ERROR EN cargarImagenPerfil ===', generalError)
            console.error('Error tipo:', generalError?.constructor?.name)
            console.error('Error message:', generalError?.message)
            console.error('Error stack:', generalError?.stack)
        }
        console.log('=== FINALIZANDO cargarImagenPerfil ===')
    }

    async function obtenerUrlImagen(userId: string) {
        console.log('=== INICIANDO obtenerUrlImagen ===')
        console.log('UserId:', userId)
        try {
            console.log('Step 1: Listando archivos en storage...')
            const { data: files, error: listError } = await supabase
                .storage
                .from('imagenes')
                .list('public', {
                    limit: 100,
                    offset: 0
                })

            if (listError) {
                console.error('Step 1 ERROR - Error listando archivos:', listError)
                return
            }

            console.log('Step 1 COMPLETADO - Archivos encontrados:', files?.length)

            const avatarFiles = files?.filter(file =>
                file.name.startsWith(`avatar_${userId}`)
            ) || []

            console.log('Step 2: Archivos de avatar filtrados:', avatarFiles.length)

            if (avatarFiles.length > 0) {
                const avatarFile = avatarFiles[0]
                console.log('Step 3: Obteniendo URL para:', avatarFile.name)
                
                const { data } = supabase
                    .storage
                    .from('imagenes')
                    .getPublicUrl(`public/${avatarFile.name}`)

                if (data) {
                    const imageUrl = data.publicUrl
                    console.log('Step 3.1 - URL base generada:', imageUrl)
                    
                    // CAMBIO: Verificar que la URL sea válida antes de usar
                    try {
                        const response = await fetch(imageUrl, { method: 'HEAD' })
                        console.log('Step 3.2 - Verificación URL response:', response.status)
                        
                        if (response.ok) {
                            const urlConTimestamp = `${imageUrl}?t=${new Date().getTime()}`
                            setImage(urlConTimestamp)
                            console.log('Step 3.2 COMPLETADO - URL válida actualizada:', urlConTimestamp)
                            
                            // CAMBIO: Actualizar BD con la URL válida
                            const { error: updateError } = await supabase
                                .from('cliente')
                                .update({ imagen: imageUrl })
                                .eq('uid', userId)
                            
                            if (updateError) {
                                console.error('Step 3.3 ERROR - Error actualizando BD:', updateError)
                            } else {
                                console.log('Step 3.3 COMPLETADO - BD actualizada con URL válida')
                            }
                        } else {
                            console.log('Step 3.2 ERROR - URL no válida, eliminando archivo corrupto')
                            // CAMBIO: Eliminar archivo corrupto
                            const { error: removeError } = await supabase
                                .storage
                                .from('imagenes')
                                .remove([`public/${avatarFile.name}`])
                            
                            if (!removeError) {
                                console.log('Step 3.2 COMPLETADO - Archivo corrupto eliminado')
                            }
                            
                            // CAMBIO: Limpiar imagen de BD
                            await supabase
                                .from('cliente')
                                .update({ imagen: null })
                                .eq('uid', userId)
                                
                            setImage(null)
                        }
                    } catch (fetchError) {
                        console.error('Step 3.2 ERROR - Error verificando URL:', fetchError)
                        setImage(null)
                    }
                }
            } else {
                console.log('Step 3 OMITIDO - No hay archivos de avatar')
                setImage(null)
            }
        } catch (generalError: any) {
            console.error('=== ERROR EN obtenerUrlImagen ===', generalError)
            console.error('Error tipo:', generalError?.constructor?.name)
            console.error('Error message:', generalError?.message)
            setImage(null)
        }
        console.log('=== FINALIZANDO obtenerUrlImagen ===')
    }

    const pickImage = async () => {
        console.log('=== INICIANDO pickImage ===')
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            console.log('ImagePicker result:', result)

            if (!result.canceled) {
                console.log('Imagen seleccionada:', result.assets[0].uri)
                setImage(result.assets[0].uri);
            } else {
                console.log('Selección de imagen cancelada')
            }
        } catch (generalError: any) { // CAMBIO: agregar tipo any
            console.error('ERROR en pickImage:', generalError)
        }
        console.log('=== FINALIZANDO pickImage ===')
    };

    const tomarFoto = async () => {
        console.log('=== INICIANDO tomarFoto ===')
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
            console.log('Permisos de cámara:', permissionResult)

            if (permissionResult.granted === false) {
                console.log('Permisos de cámara denegados')
                Alert.alert("Permisos necesarios", "Necesitas dar permisos para usar la cámara")
                return
            }

            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            })

            console.log('Resultado de cámara:', result)

            if (!result.canceled) {
                console.log('Foto tomada:', result.assets[0].uri)
                setImage(result.assets[0].uri)
            }
        } catch (generalError: any) { // CAMBIO: agregar tipo any
            console.error('ERROR en tomarFoto:', generalError)
        }
        console.log('=== FINALIZANDO tomarFoto ===')
    }

    const eliminarFoto = async () => {
        console.log('=== INICIANDO eliminarFoto ===')
        if (!usuario?.id) {
            console.log('ERROR - No hay usuario ID')
            return
        }

        try {
            console.log('Step 1: Buscando archivos a eliminar...')
            const { data: files, error: listError } = await supabase
                .storage
                .from('imagenes')
                .list('public', { 
                    search: `avatar_${usuario.id}` 
                })

            if (listError) {
                console.error('Step 1 ERROR:', listError)
                Alert.alert('Error', 'No se pudo encontrar la imagen')
                return
            }

            console.log('Step 1 COMPLETADO - Archivos encontrados:', files?.length)

            if (files && files.length > 0) {
                console.log('Step 2: Eliminando de storage...')
                const filesToDelete = files.map(file => `public/${file.name}`)
                console.log('Archivos a eliminar:', filesToDelete)
                
                const { error: removeError } = await supabase
                    .storage
                    .from('imagenes')
                    .remove(filesToDelete)

                if (removeError) {
                    console.error('Step 2 ERROR:', removeError)
                    Alert.alert('Error', 'No se pudo eliminar la imagen del storage')
                    return
                }
                console.log('Step 2 COMPLETADO - Archivos eliminados')
            }

            console.log('Step 3: Actualizando BD...')
            const { error: dbError } = await supabase
                .from('cliente')
                .update({ imagen: null })
                .eq('uid', usuario.id)

            if (dbError) {
                console.error('Step 3 ERROR:', dbError)
                Alert.alert('Error', 'No se pudo actualizar el perfil')
                return
            }

            console.log('Step 3 COMPLETADO - BD actualizada')

            if (cliente) {
                setCliente({
                    ...cliente,
                    imagen: null
                })
            }

            setImage(null)
            Alert.alert('Éxito', 'Foto de perfil eliminada')

        } catch (generalError: any) { // CAMBIO: agregar tipo any
            console.error('=== ERROR EN eliminarFoto ===', generalError)
            Alert.alert('Error', 'Ocurrió un error inesperado')
        }
        console.log('=== FINALIZANDO eliminarFoto ===')
    }

    const handleSaveName = async () => {
        console.log('=== INICIANDO handleSaveName ===')
        console.log('Nombre a guardar:', tempName)
        
        if (cliente && usuario?.id) {
            try {
                console.log('Step 1: Actualizando nombre en BD...')
                const { data, error } = await supabase
                    .from('cliente')
                    .update({ nombre_completo: tempName })
                    .eq('uid', usuario.id);

                if (error) {
                    console.error('Step 1 ERROR:', error.message);
                    Alert.alert('Error', 'No se pudo actualizar el nombre.');
                } else {
                    console.log('Step 1 COMPLETADO - Nombre actualizado:', data)
                    setCliente({
                        ...cliente,
                        nombre_completo: tempName
                    });
                    Alert.alert('Éxito', 'Nombre actualizado correctamente.');
                }
            } catch (generalError: any) { // CAMBIO: agregar tipo any
                console.error('=== ERROR EN handleSaveName ===', generalError);
                Alert.alert('Error', 'Ocurrió un error al intentar guardar el nombre.');
            }
        }
        setEditingName(false)
        console.log('=== FINALIZANDO handleSaveName ===')
    }

    const handleCancelEdit = () => {
        console.log('=== handleCancelEdit ===')
        setTempName('')
        setEditingName(false)
    }

    const handleEditName = () => {
        console.log('=== handleEditName ===')
        setTempName(cliente?.nombre_completo || usuario?.email?.split('@')[0] || '')
        setEditingName(true)
    }

    const getInitials = (name: string) => {
        if (!name) return 'U'
        const names = name.split(' ')
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase()
        }
        return name[0].toUpperCase()
    }

    async function subirImagen() {
        console.log('=== INICIANDO subirImagen ===')
        console.log('Imagen URI:', image)
        console.log('Usuario ID:', usuario?.id)
        
        if (!image || !usuario?.id) {
            console.log('ERROR - Validación inicial fallida')
            Alert.alert('Error', 'No hay imagen seleccionada o usuario no válido')
            return
        }

        setUploading(true)

        try {
            console.log('Step 1: Verificando autenticación...')
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError) {
                console.error('Step 1 ERROR - Error de autenticación:', authError)
                Alert.alert('Error', 'No estás autenticado correctamente')
                return
            }

            console.log('Step 1 COMPLETADO - Usuario autenticado:', user?.id)

            console.log('Step 2: Preparando archivo...')
            console.log('Step 2.1: Creando FormData...')
            
            // CAMBIO: Usar FormData en lugar de fetch + blob
            const formData = new FormData()
            
            // CAMBIO: Crear objeto de archivo compatible
            const fileUri = image
            const fileName = `avatar_${usuario.id}.jpg`
            
            // CAMBIO: Agregar archivo al FormData
            formData.append('file', {
                uri: fileUri,
                type: 'image/jpeg',
                name: fileName,
            } as any)

            console.log('Step 2.1 COMPLETADO - FormData creado')
            console.log('Step 2.2: Preparando path...')
            
            const filePath = `public/${fileName}`
            console.log('Step 2.2 COMPLETADO - Path preparado:', filePath)

            console.log('Step 3: Verificando archivos existentes...')
            const { data: existingFile, error: listError } = await supabase
                .storage
                .from('imagenes')
                .list('public', { 
                    search: `avatar_${usuario.id}` 
                })

            if (listError) {
                console.error('Step 3 ERROR - Error listando:', listError)
            } else {
                console.log('Step 3 COMPLETADO - Archivos existentes:', existingFile?.length)
            }

            console.log('Step 4: Convirtiendo imagen a ArrayBuffer...')
            
            // CAMBIO: Método alternativo para manejar la imagen
            const response = await fetch(image)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const arrayBuffer = await response.arrayBuffer()
            const uint8Array = new Uint8Array(arrayBuffer)
            
            console.log('Step 4 COMPLETADO - ArrayBuffer size:', arrayBuffer.byteLength, 'bytes')

            let uploadResult

            if (existingFile && existingFile.length > 0) {
                console.log('Step 5: Actualizando imagen existente...')
                uploadResult = await supabase
                    .storage
                    .from('imagenes')
                    .update(filePath, uint8Array, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: 'image/jpeg'
                    })
                console.log('Step 5 COMPLETADO - Update result:', uploadResult)
            } else {
                console.log('Step 5: Subiendo nueva imagen...')
                uploadResult = await supabase
                    .storage
                    .from('imagenes')
                    .upload(filePath, uint8Array, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: 'image/jpeg'
                    })
                console.log('Step 5 COMPLETADO - Upload result:', uploadResult)
            }

            const { data: uploadData, error: uploadError } = uploadResult

            if (uploadError) {
                console.error('Step 5 ERROR - Error subiendo:', uploadError)
                Alert.alert('Error', `No se pudo subir la imagen: ${uploadError.message}`)
                return
            }

            console.log('Step 6: Obteniendo URL pública...')
            const { data: urlData } = await supabase
                .storage
                .from('imagenes')
                .getPublicUrl(filePath)

            const imageUrl = urlData.publicUrl
            console.log('Step 6 COMPLETADO - URL generada:', imageUrl)

            console.log('Step 7: Actualizando tabla cliente...')
            const { data: updateData, error: updateError } = await supabase
                .from('cliente')
                .update({ imagen: imageUrl })
                .eq('uid', usuario.id)

            if (updateError) {
                console.error('Step 7 ERROR - Error actualizando BD:', updateError)
                Alert.alert('Error', 'Imagen subida pero no se pudo actualizar el perfil')
                return
            }

            console.log('Step 7 COMPLETADO - BD actualizada:', updateData)

            console.log('Step 8: Actualizando estados locales...')
            if (cliente) {
                setCliente({
                    ...cliente,
                    imagen: imageUrl
                })
            }

            const urlConTimestamp = `${imageUrl}?t=${Date.now()}`
            setImage(urlConTimestamp)
            console.log('Step 8 COMPLETADO - Estados actualizados')

            Alert.alert('Éxito', 'Foto de perfil actualizada correctamente')

        } catch (generalError: any) {
            console.error('=== ERROR EN subirImagen ===', generalError)
            console.error('Error tipo:', generalError?.constructor?.name)
            console.error('Error message:', generalError?.message)
            console.error('Error stack:', generalError?.stack)
            
            // CAMBIO: Manejo de errores más específico
            if (generalError?.message?.includes('Network request failed')) {
                Alert.alert('Error de Red', 'No se pudo procesar la imagen. Intenta seleccionar otra imagen.')
            } else if (generalError?.message?.includes('HTTP error')) {
                Alert.alert('Error HTTP', 'Error al acceder a la imagen seleccionada.')
            } else if (generalError?.message?.includes('fetch')) {
                Alert.alert('Error de Fetch', 'No se pudo procesar la imagen seleccionada.')
            } else {
                Alert.alert('Error', 'Ocurrió un error inesperado al subir la imagen.')
            }
        } finally {
            console.log('=== FINALIZANDO subirImagen ===')
            setUploading(false)
        }
    }

    async function cerrarSesion() {
        console.log('=== cerrarSesion ===')
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
                        console.log('Cerrando sesión...')
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

    const mostrarOpcionesImagen = () => {
        console.log('=== mostrarOpcionesImagen ===')
        Alert.alert(
            "Foto de Perfil",
            "¿Qué deseas hacer?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Seleccionar de Galería", onPress: pickImage },
                { text: "Tomar Foto", onPress: tomarFoto },
                ...(image ? [{ text: "Eliminar Foto", onPress: eliminarFoto, style: "destructive" as const }] : [])
            ]
        )
    }

    if (loadingData) {
        console.log('=== RENDERIZANDO LOADING ===')
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    console.log('=== RENDERIZANDO PERFIL ===')
    console.log('Estado imagen:', image)
    console.log('Estado cliente:', cliente?.nombre_completo)
    console.log('Estado usuario:', usuario?.email)

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
                            onPress={mostrarOpcionesImagen}
                            activeOpacity={0.7}
                        >
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.avatarImage}
                                    onLoad={() => console.log('=== IMAGEN CARGADA EN COMPONENTE ===')}
                                    onError={(error) => {
                                        console.error('=== ERROR CARGANDO IMAGEN EN COMPONENTE ===', error.nativeEvent.error)
                                        console.log('URL que falló:', image)
                                        // CAMBIO: No setear null inmediatamente, intentar cargar de nuevo
                                        if (usuario?.id) {
                                            console.log('Intentando recargar imagen desde storage...')
                                            obtenerUrlImagen(usuario.id)
                                        } else {
                                            setImage(null)
                                        }
                                    }}
                                    key={image}
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

                    {image && !cliente?.imagen && (
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
                        {usuario?.created_at ? new Date(usuario?.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }) : 'N/A'}
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

                <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                    <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Ayuda y Soporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
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
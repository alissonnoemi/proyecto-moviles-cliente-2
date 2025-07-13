import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRoute, useNavigation } from '@react-navigation/native'
import { solicitudStyles as styles } from '../styles/SolicitudScreenStyles'
import { supabase } from '../supabase/Config'

interface ServicioSeleccionado {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function SolicitudScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const emprendimiento = route.params?.emprendimiento
  const serviciosDisponibles = route.params?.servicios || []

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  })

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioSeleccionado[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    cargarDatosUsuario()
  }, [])

  useEffect(() => {
    calcularTotal()
  }, [serviciosSeleccionados])

  const cargarDatosUsuario = async () => {
    
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('UID del usuario autenticado:', user.id)
        
        // Buscar cliente existente
        const { data: clienteData, error } = await supabase
          .from('cliente')
          .select('*')
          .eq('uid', user.id)
          .single()

        if (error) {
          console.error('Error obteniendo datos del cliente:', error)
          
          Alert.alert('Error', 'No se pudo cargar la información del cliente. Inténtalo nuevamente.')
          navigation.goBack()
        } else {
          console.log('Cliente encontrado:', clienteData)
          // Cargar todos los datos del cliente
          setFormData(prev => ({
            ...prev,
            nombre: clienteData.nombre_completo || '',
            email: clienteData.correo || user.email || '',
            telefono: clienteData.cedula || ''
          }))
        }
      }
     
  }

  const calcularTotal = () => {
    const nuevoTotal = serviciosSeleccionados.reduce((sum, servicio) => sum + servicio.subtotal, 0)
    setTotal(nuevoTotal)
  }

  const agregarServicio = (servicio: any) => {
    const servicioExistente = serviciosSeleccionados.find(s => s.id_servicio === servicio.id_servicio)
    
    if (servicioExistente) {
      Alert.alert('Servicio ya agregado', 'Este servicio ya está en tu solicitud. Puedes cambiar la cantidad.')
      return
    }

    const nuevoServicio: ServicioSeleccionado = {
      id_servicio: servicio.id_servicio,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      cantidad: 1,
      subtotal: servicio.precio
    }

    setServiciosSeleccionados([...serviciosSeleccionados, nuevoServicio])
  }

  const actualizarCantidad = (id_servicio: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) {
      eliminarServicio(id_servicio)
      return
    }

    setServiciosSeleccionados(serviciosSeleccionados.map(servicio => 
      servicio.id_servicio === id_servicio 
        ? { ...servicio, cantidad: nuevaCantidad, subtotal: servicio.precio * nuevaCantidad }
        : servicio
    ))
  }

  const eliminarServicio = (id_servicio: number) => {
    setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id_servicio !== id_servicio))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.email) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios')
      return
    }

    if (serviciosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un servicio')
      return
    }

    try {
      //Obtener el usuario 
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        Alert.alert('Error', 'No se pudo obtener información del usuario')
        return
      }
      //Crear una solicitud 
      const solicitudes = serviciosSeleccionados.map(servicio => ({
        uid_cliente: user.id,          
        id_servicio: servicio.id_servicio,   
        estado: 'SOLICITADO',           
        total: servicio.subtotal,       
        cantidad: servicio.cantidad    
      }))

      const { data, error } = await supabase
        .from('solicitud')
        .insert(solicitudes)
        .select()

      const resumenSolicitud = serviciosSeleccionados.map(s => 
        `${s.nombre} (Cantidad: ${s.cantidad}) - $${s.subtotal}`
      ).join('\n')

      Alert.alert(
        'Solicitud Enviada',
        `Tu solicitud para ${emprendimiento?.name} ha sido enviada exitosamente.\n\nServicios:\n${resumenSolicitud}\n\nTotal: $${total}\n\nTe contactaremos pronto.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      )

    } catch (error) {
      console.error('Error enviando solicitud:', error)
      Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo nuevamente.')
    }
  }
  const renderFormItems = () => {
    const items = [
      { type: 'title', key: 'title' },
      { type: 'nombre', key: 'nombre' },
      { type: 'email', key: 'email' },
      { type: 'telefono', key: 'telefono' },
      { type: 'servicios-disponibles', key: 'servicios-disponibles' },
      ...serviciosDisponibles.map((servicio: any) => ({
        type: 'servicio-disponible',
        key: `servicio-${servicio.id_servicio}`,
        servicio
      })),
      ...(serviciosSeleccionados.length > 0 ? [{ type: 'servicios-seleccionados', key: 'servicios-seleccionados' }] : []),
      ...serviciosSeleccionados.map((servicio) => ({
        type: 'servicio-seleccionado',
        key: `seleccionado-${servicio.id_servicio}`,
        servicio
      })),
      ...(serviciosSeleccionados.length > 0 ? [{ type: 'total', key: 'total' }] : []),
      { type: 'mensaje', key: 'mensaje' },
      { type: 'botones', key: 'botones' }
    ]
    return items
  }

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'title':
        return (
          <View>
            <Text style={styles.formTitle}>Formulario de Solicitud</Text>
            <Text style={styles.formSubtitle}>Completa la información para contactar con {emprendimiento.name}</Text>
          </View>
        )

      case 'nombre':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nombre Completo *</Text>
            <TextInput
              style={[styles.textInput, styles.textInputReadOnly]}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Ingresa tu nombre completo"
              placeholderTextColor="#999"
              editable={false}
            />
          </View>
        )

      case 'email':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email *</Text>
            <TextInput
              style={[styles.textInput, styles.textInputReadOnly]}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
          </View>
        )
      case 'servicios-disponibles':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Servicios Disponibles</Text>
          </View>
        )

      case 'servicio-disponible':
        return (
          <TouchableOpacity
            style={styles.servicioDisponible}
            onPress={() => agregarServicio(item.servicio)}
          >
            <View style={styles.servicioInfo}>
              <Text style={styles.servicioNombre}>{item.servicio.nombre}</Text>
              <Text style={styles.servicioDescripcion}>{item.servicio.descripcion}</Text>
            </View>
            <View style={styles.servicioPrecio}>
              <Text style={styles.servicioTexto}>${item.servicio.precio}</Text>
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        )

      case 'servicios-seleccionados':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Servicios Seleccionados</Text>
          </View>
        )

      case 'servicio-seleccionado':
        return (
          <View style={styles.servicioSeleccionado}>
            <View style={styles.servicioInfo}>
              <Text style={styles.servicioNombre}>{item.servicio.nombre}</Text>
              <Text style={styles.servicioDescripcion}>${item.servicio.precio} c/u</Text>
            </View>
            <View style={styles.cantidadContainer}>
              <TouchableOpacity
                style={styles.cantidadButton}
                onPress={() => actualizarCantidad(item.servicio.id_servicio, item.servicio.cantidad - 1)}
              >
                <Ionicons name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.cantidadTexto}>{item.servicio.cantidad}</Text>
              <TouchableOpacity
                style={styles.cantidadButton}
                onPress={() => actualizarCantidad(item.servicio.id_servicio, item.servicio.cantidad + 1)}
              >
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.subtotalTexto}>${item.servicio.subtotal}</Text>
              <TouchableOpacity
                style={styles.eliminarButton}
                onPress={() => eliminarServicio(item.servicio.id_servicio)}
              >
                <Ionicons name="trash" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        )

      case 'total':
        return (
          <View style={styles.totalContainer}>
            <Text style={styles.totalTexto}>Total: ${total}</Text>
          </View>
        )
      case 'botones':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
            </TouchableOpacity>
          </View>
        )

      default:
        return null
    }
  }

  if (!emprendimiento) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>No se encontró información del emprendimiento</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Image source={{ uri: emprendimiento.image }} style={styles.emprendimientoImage} />
          <View style={styles.emprendimientoInfo}>
            <Text style={styles.emprendimientoName}>{emprendimiento.name}</Text>
            <Text style={styles.emprendimientoCategory}>{emprendimiento.category}</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={renderFormItems()}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
      />
    </View>
  )
}
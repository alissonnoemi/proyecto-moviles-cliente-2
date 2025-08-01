import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, Image, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRoute, useNavigation } from '@react-navigation/native'
import { solicitudStyles as styles } from '../styles/SolicitudScreenStyles'
import { supabase } from '../supabase/Config'

interface ServicioSeleccionado {
  id_servicio: number
  nombre: string
  descripcion: string
  precio: number
  cantidad: number
  subtotal: number
}
export default function SolicitudScreen() {
  const ruta = useRoute<any>()
  const navegacion = useNavigation<any>()
  const emprendimiento = ruta.params?.emprendimiento
  const serviciosDisponibles = ruta.params?.servicios || []
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioSeleccionado[]>([])
  const [total, setTotal] = useState(0)
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  })
  
  useEffect(() => {
    cargarDatosUsuario()
  }, [])

  useEffect(() => {
    const nuevoTotal = serviciosSeleccionados.reduce((suma, servicio) => suma + servicio.subtotal, 0)
    setTotal(nuevoTotal)
  }, [serviciosSeleccionados])

  const cargarDatosUsuario = async () => {
      const { data: { user: usuario } } = await supabase.auth.getUser()
      if (!usuario) {
        console.error('Usuario no encontrado')
        navegacion.goBack()
        return
      }

      const { data: datosCliente, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('uid', usuario.id)
        .single()

      if (error) {
        console.error('Error obteniendo datos del cliente:', error)
        Alert.alert('Error', 'No se pudo cargar la información del cliente')
        navegacion.goBack()
      } else {
        setDatosFormulario(prev => ({
          ...prev,
          nombre: datosCliente.nombre_completo || '',
          email: datosCliente.correo || usuario.email || '',
        }))
      }
  }

  const agregarServicio = (servicio: any) => {
    const servicioExistente = serviciosSeleccionados.find(s => s.id_servicio === servicio.id_servicio)
    
    if (servicioExistente) {
      Alert.alert('Servicio ya agregado', 'Este servicio ya está en tu solicitud')
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

  const manejarEnvio = async () => {
    if (!datosFormulario.nombre || !datosFormulario.email) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios')
      return
    }

    if (serviciosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un servicio')
      return
    }

    try {
      const { data: { user: usuario } } = await supabase.auth.getUser()

      const solicitudes = serviciosSeleccionados.map(servicio => ({
        uid_cliente: usuario!.id, 
        id_servicio: servicio.id_servicio,   
        estado: 'SOLICITADO',           
        total: servicio.subtotal,       
        cantidad: servicio.cantidad    
      }))

      const { error } = await supabase
        .from('solicitud')
        .insert(solicitudes)

      if (error) {
        console.error('Error guardando solicitud:', error)
        Alert.alert('Error', 'No se pudo enviar la solicitud')
        return
      }

      Alert.alert(
        'Solicitud Enviada',
        `Tu solicitud ha sido enviada exitosamente.\n\nTotal: $${total}\n\nTe contactaremos pronto.`,
        [{ text: 'OK', onPress: () => navegacion.goBack() }]
      )

    } catch (error) {
      console.error('Error enviando solicitud:', error)
      Alert.alert('Error', 'Ocurrió un error inesperado')
    }
  }

  const encabezado = () => (
    <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <Image source={{ uri: emprendimiento.image }} style={styles.emprendimientoImage} />
        <View style={styles.emprendimientoInfo}>
          <Text style={styles.emprendimientoName}>{emprendimiento.name}</Text>
          <Text style={styles.emprendimientoCategory}>{emprendimiento.category}</Text>
        </View>
      </View>
    </LinearGradient>
  )

  const tituloFormulario = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.formTitle}>Formulario de Solicitud</Text>
      <Text style={styles.formSubtitle}>Completa la información para contactar con {emprendimiento.name}</Text>
    </View>
  )

  const camposFormulario = () => (
    <View style={styles.formFieldsContainer}>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Nombre Completo</Text>
        <TextInput
          style={[styles.textInput, styles.textInputReadOnly]}
          value={datosFormulario.nombre}
          placeholderTextColor="#999"
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          style={[styles.textInput, styles.textInputReadOnly]}
          value={datosFormulario.email}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          editable={false}
        />
      </View>
    </View>
  )

  const erviciosDisponibles = () => (
    <View style={styles.serviciosSection}>
      <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
      {serviciosDisponibles.map((servicio: any) => (
        <TouchableOpacity
          key={servicio.id_servicio}
          style={styles.servicioDisponible}
          onPress={() => agregarServicio(servicio)}
        >
          <View style={styles.servicioInfo}>
            <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
            <Text style={styles.servicioDescripcion}>{servicio.descripcion}</Text>
          </View>
          <View style={styles.servicioPrecio}>
            <Text style={styles.servicioTexto}>${servicio.precio}</Text>
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  const sserviciosSeleccionados = () => {
    if (serviciosSeleccionados.length === 0) return null

    return (
      <View style={styles.serviciosSection}>
        <Text style={styles.sectionTitle}>Servicios Seleccionados</Text>
        {serviciosSeleccionados.map((servicio) => (
          <View key={servicio.id_servicio} style={styles.servicioSeleccionado}>
            <View style={styles.servicioInfo}>
              <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
              <Text style={styles.servicioDescripcion}>${servicio.precio} c/u</Text>
            </View>
            <View style={styles.cantidadContainer}>
              <TouchableOpacity
                style={styles.cantidadButton}
                onPress={() => actualizarCantidad(servicio.id_servicio, servicio.cantidad - 1)}
              >
                <Ionicons name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.cantidadTexto}>{servicio.cantidad}</Text>
              <TouchableOpacity
                style={styles.cantidadButton}
                onPress={() => actualizarCantidad(servicio.id_servicio, servicio.cantidad + 1)}
              >
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.subtotalTexto}>${servicio.subtotal}</Text>
              <TouchableOpacity
                style={styles.eliminarButton}
                onPress={() => eliminarServicio(servicio.id_servicio)}
              >
                <Ionicons name="trash" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalTexto}>Total: ${total}</Text>
        </View>
      </View>
    )
  }

  const botones = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navegacion.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={manejarEnvio}>
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
      </TouchableOpacity>
    </View>
  )

  if (!emprendimiento) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>No se encontró información del emprendimiento</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navegacion.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {encabezado()}
      
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={styles.formContainer}>
            {tituloFormulario()}
            {camposFormulario()}
            {erviciosDisponibles()}
            {sserviciosSeleccionados()}
            {botones()}
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
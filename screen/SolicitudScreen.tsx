import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRoute, useNavigation } from '@react-navigation/native'
import { solicitudStyles as styles } from '../styles/SolicitudScreenStyles'
import { supabase } from '../supabase/Config'

export default function SolicitudScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const emprendimiento = route.params?.emprendimiento

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    tipoSolicitud: 'Información',
    presupuesto: ''
  })

  useEffect(() => {
    cargarDatosUsuario()
  }, [])

  const cargarDatosUsuario = async () => {

      //obtener usuario
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        //cliente de la tabla
        const { data: clienteData } = await supabase
          .from('cliente')
          .select('*')
          .eq('uid', user.id)
          .single()

        //carga de datos desde el form
        setFormData(prev => ({
          ...prev,
          nombre: clienteData?.nombre_completo || '',
          email: user.email || ''
        }))
      }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios')
      return
    }

    Alert.alert(
      'Solicitud Enviada',
      `Tu solicitud para ${emprendimiento?.name} ha sido enviada exitosamente. Te contactaremos pronto.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    )
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Image source={{ uri: emprendimiento.image }} style={styles.emprendimientoImage} />
          <View style={styles.emprendimientoInfo}>
            <Text style={styles.emprendimientoName}>{emprendimiento.name}</Text>
            <Text style={styles.emprendimientoCategory}>{emprendimiento.category}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{emprendimiento.rating}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Formulario de Solicitud</Text>
        <Text style={styles.formSubtitle}>Completa la información para contactar con {emprendimiento.name}</Text>

  
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Nombre Completo *</Text>
          <TextInput
            style={[styles.textInput, !formData.nombre && styles.textInputEmpty]}
            value={formData.nombre}
            onChangeText={(value) => handleInputChange('nombre', value)}
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="#999"
          />
          {!formData.nombre && (
            <Text style={styles.helperText}>
              Complete su perfil para que este campo se llene automáticamente
            </Text>
          )}
        </View>

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
          <Text style={styles.helperText}>
            Este campo se carga automáticamente con su cuenta
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Teléfono</Text>
          <TextInput
            style={styles.textInput}
            value={formData.telefono}
            onChangeText={(value) => handleInputChange('telefono', value)}
            placeholder="+593 999 999 999"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>


        {formData.tipoSolicitud === 'Solicitar Cotización' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Presupuesto Estimado (USD)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.presupuesto}
              onChangeText={(value) => handleInputChange('presupuesto', value)}
              placeholder="Ej: 500 - 1000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        )}


        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Mensaje *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.mensaje}
            onChangeText={(value) => handleInputChange('mensaje', value)}
            placeholder="Describe tu solicitud detalladamente..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>


        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Información del Emprendimiento</Text>
          <Text style={styles.infoCardDescription}>{emprendimiento.description}</Text>
          <View style={styles.infoCardDetails}>
            <View style={styles.infoCardRow}>
              <Ionicons name="business-outline" size={16} color="#666" />
              <Text style={styles.infoCardText}>Categoría: {emprendimiento.category}</Text>
            </View>
            <View style={styles.infoCardRow}>
              <Ionicons name="star-outline" size={16} color="#666" />
              <Text style={styles.infoCardText}>Calificación: {emprendimiento.rating}/5</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
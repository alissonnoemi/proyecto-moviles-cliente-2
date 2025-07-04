import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { screen2Styles as styles } from '../styles/Screen2Styles'

export default function Screen2() {
  const servicios = [
    {
      id: 1,
      name: 'Desarrollo Web',
      provider: 'TechSolutions',
      price: '$500 - $2000',
      icon: 'code-slash',
      color: '#4CAF50',
      description: 'Desarrollo de sitios web modernos y responsivos'
    },
    {
      id: 2,
      name: 'Consultoría Ambiental',
      provider: 'EcoVerde',
      price: '$100 - $500',
      icon: 'leaf',
      color: '#2E7D32',
      description: 'Asesoría para empresas sustentables'
    },
    {
      id: 3,
      name: 'Catering Eventos',
      provider: 'FoodDelight',
      price: '$20 - $50 por persona',
      icon: 'restaurant',
      color: '#FF9800',
      description: 'Servicio de catering para eventos especiales'
    },
    {
      id: 4,
      name: 'Diseño Gráfico',
      provider: 'CreativeStudio',
      price: '$200 - $800',
      icon: 'color-palette',
      color: '#9C27B0',
      description: 'Diseño de identidad visual y branding'
    },
    {
      id: 5,
      name: 'Marketing Digital',
      provider: 'DigitalBoost',
      price: '$300 - $1500',
      icon: 'trending-up',
      color: '#FF5722',
      description: 'Estrategias de marketing en redes sociales'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Servicios</Text>
        <Text style={styles.subtitle}>Encuentra el servicio que necesitas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {servicios.map((servicio) => (
            <TouchableOpacity key={servicio.id} style={styles.serviceCard}>
              <View style={[styles.iconContainer, { backgroundColor: servicio.color }]}>
                <Ionicons name={servicio.icon as any} size={24} color="#FFFFFF" />
              </View>
              
              <Text style={styles.serviceName}>{servicio.name}</Text>
              <Text style={styles.providerName}>{servicio.provider}</Text>
              <Text style={styles.serviceDescription}>{servicio.description}</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Desde</Text>
                <Text style={styles.price}>{servicio.price}</Text>
              </View>
              
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contactar</Text>
                <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}


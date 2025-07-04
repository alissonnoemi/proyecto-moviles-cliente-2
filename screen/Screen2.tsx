import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  providerName: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 15,
  },
  priceContainer: {
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  contactButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
})
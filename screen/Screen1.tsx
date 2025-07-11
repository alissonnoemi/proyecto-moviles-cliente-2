import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { screen1Styles as styles } from '../styles/Screen1Styles'

export default function Screen1() {
  const navigation = useNavigation<any>()

  const emprendimientos = [
    {
      id: 1,
      name: 'TechSolutions',
      category: 'Tecnología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Soluciones tecnológicas innovadoras'
    },
    {
      id: 2,
      name: 'EcoVerde',
      category: 'Sustentabilidad',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Productos ecológicos y sustentables'
    },
    {
      id: 3,
      name: 'FoodDelight',
      category: 'Alimentación',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Comida artesanal y deliciosa'
    }
  ];

  const handleSolicitar = (emprendimiento: any) => {
    navigation.navigate('Solicitud', { emprendimiento })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emprendimientos</Text>
        <Text style={styles.subtitle}>Descubre ideas innovadoras</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {emprendimientos.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.rating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => handleSolicitar(item)}
              >
                <Text style={styles.viewButtonText}>Solicitar</Text>
                <Ionicons name="arrow-forward" size={16} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}


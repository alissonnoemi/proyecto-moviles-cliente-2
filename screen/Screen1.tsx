import { Text, View, ScrollView } from 'react-native'
import React from 'react'
import { screen1Styles as styles } from '../styles/Screen1Styles'
import Emprendimientos from '../components/emprendimientos'

export default function Screen1() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emprendimientos</Text>
        <Text style={styles.subtitle}>Descubre ideas innovadoras</Text>
      </View>
      
      <View style={styles.content}>
        <Emprendimientos />
      </View>
    </View>
  )
}


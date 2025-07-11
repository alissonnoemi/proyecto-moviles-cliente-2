import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { reseniaStyles as styles } from '../styles/ReseniaStyles'

interface Resenia {
    id: number;
    nombre: string;
    avatar: string;
    rating: number;
    fecha: string;
    comentario: string;
    servicio: string;
    verificado: boolean;
}

const reseniasMockData: Resenia[] = [
    {
        id: 1,
        nombre: "María González",
        avatar: "MG",
        rating: 5,
        fecha: "2024-01-15",
        comentario: "Excelente servicio, muy profesional y puntual. La calidad del trabajo superó mis expectativas. Definitivamente recomendaría este servicio a otros.",
        servicio: "Desarrollo Web",
        verificado: true
    },
    {
        id: 2,
        nombre: "Carlos Rodríguez",
        avatar: "CR",
        rating: 4,
        fecha: "2024-01-10",
        comentario: "Muy buen trabajo, aunque el tiempo de entrega fue un poco más largo de lo esperado. El resultado final fue satisfactorio.",
        servicio: "Diseño Gráfico",
        verificado: true
    },
    {
        id: 3,
        nombre: "Ana Martínez",
        avatar: "AM",
        rating: 5,
        fecha: "2024-01-08",
        comentario: "¡Increíble experiencia! El equipo fue muy atento y colaborativo. El proyecto se completó antes del plazo establecido.",
        servicio: "Marketing Digital",
        verificado: false
    },
    {
        id: 4,
        nombre: "Luis Fernández",
        avatar: "LF",
        rating: 3,
        fecha: "2024-01-05",
        comentario: "Servicio promedio. Cumple con lo básico pero creo que podría mejorar en la comunicación durante el proceso.",
        servicio: "Consultoría",
        verificado: true
    },
    {
        id: 5,
        nombre: "Isabella Torres",
        avatar: "IT",
        rating: 5,
        fecha: "2024-01-03",
        comentario: "Fantástico servicio desde el primer contacto. Muy profesionales, creativos y con excelente atención al detalle.",
        servicio: "Desarrollo Mobile",
        verificado: true
    },
    {
        id: 6,
        nombre: "Roberto Silva",
        avatar: "RS",
        rating: 4,
        fecha: "2023-12-28",
        comentario: "Buen trabajo en general. La comunicación fue fluida y el resultado cumplió con mis expectativas.",
        servicio: "SEO",
        verificado: false
    }
];

export default function ReseniaScreen() {
    const [filtroRating, setFiltroRating] = useState<number | null>(null);
    const [mostrarSoloVerificadas, setMostrarSoloVerificadas] = useState(false);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={16}
                    color={i <= rating ? "#FFD700" : "#C7C7CC"}
                />
            );
        }
        return stars;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const reseniasFiltradas = reseniasMockData.filter(resenia => {
        if (filtroRating && resenia.rating !== filtroRating) return false;
        if (mostrarSoloVerificadas && !resenia.verificado) return false;
        return true;
    });

    const promedioRating = reseniasMockData.reduce((sum, r) => sum + r.rating, 0) / reseniasMockData.length;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Reseñas de Clientes</Text>
                    <View style={styles.ratingOverview}>
                        <View style={styles.ratingNumber}>
                            <Text style={styles.ratingText}>{promedioRating.toFixed(1)}</Text>
                            <View style={styles.starsContainer}>
                                {renderStars(Math.round(promedioRating))}
                            </View>
                        </View>
                        <Text style={styles.totalReviews}>
                            Basado en {reseniasMockData.length} reseñas
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.filtersContainer}>
                <Text style={styles.filtersTitle}>Filtrar por:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.filterButton, filtroRating === null && styles.filterButtonActive]}
                        onPress={() => setFiltroRating(null)}
                    >
                        <Text style={[styles.filterText, filtroRating === null && styles.filterTextActive]}>
                            Todas
                        </Text>
                    </TouchableOpacity>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <TouchableOpacity
                            key={rating}
                            style={[styles.filterButton, filtroRating === rating && styles.filterButtonActive]}
                            onPress={() => setFiltroRating(rating)}
                        >
                            <Ionicons name="star" size={14} color={filtroRating === rating ? "#fff" : "#FFD700"} />
                            <Text style={[styles.filterText, filtroRating === rating && styles.filterTextActive]}>
                                {rating}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.reseniasList}>
                {reseniasFiltradas.map(resenia => (
                    <View key={resenia.id} style={styles.reseniaCard}>
                        <View style={styles.reseniaHeader}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{resenia.avatar}</Text>
                                </View>
                                <View style={styles.userDetails}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.userName}>{resenia.nombre}</Text>
                                        {resenia.verificado && (
                                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                        )}
                                    </View>
                                    <Text style={styles.serviceText}>{resenia.servicio}</Text>
                                </View>
                            </View>
                            <View style={styles.ratingDate}>
                                <View style={styles.ratingRow}>
                                    {renderStars(resenia.rating)}
                                </View>
                                <Text style={styles.dateText}>{formatDate(resenia.fecha)}</Text>
                            </View>
                        </View>
                        <Text style={styles.comentario}>{resenia.comentario}</Text>
                        <View style={styles.reseniaFooter}>
                            <TouchableOpacity style={styles.helpfulButton}>
                                <Ionicons name="thumbs-up-outline" size={16} color="#666" />
                                <Text style={styles.helpfulText}>Útil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

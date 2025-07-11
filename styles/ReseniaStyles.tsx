import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const reseniaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerGradient: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    ratingOverview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingNumber: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    ratingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 5,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    totalReviews: {
        fontSize: 14,
        color: '#fff',
    },
    filtersContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 10,
    },
    filtersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#e0e0e0',
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
        color: '#333',
    },
    filterTextActive: {
        color: '#fff',
    },
    reseniasList: {
        paddingHorizontal: 15,
    },
    reseniaCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    reseniaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    userDetails: {
        flexDirection: 'column',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginRight: 5,
    },
    serviceText: {
        fontSize: 14,
        color: '#666',
    },
    ratingDate: {
        alignItems: 'flex-end',
    },
    ratingRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    comentario: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    reseniaFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpfulText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    addReviewContainer: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    addReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 2,
    },
    addReviewText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginLeft: 5,
    },
})
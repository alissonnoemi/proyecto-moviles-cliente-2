import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'space-between',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
        gap: 15,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: 18,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    registerButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

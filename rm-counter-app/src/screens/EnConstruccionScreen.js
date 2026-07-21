import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EnConstruccionScreen({ navigation, route }) {
  // Recibimos opcionalmente el nombre de la funcionalidad desde las opciones o parámetros
  const nombrePantalla = route.params?.titulo || route.name || 'Esta sección';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={64} color="#3498db" />
        </View>

        <Text style={styles.titulo}>Sección en desarrollo</Text>

        <Text style={styles.descripcion}>
          Estamos trabajando en <Text style={styles.resaltado}>{nombrePantalla}</Text>. Próximamente estará disponible.
        </Text>

        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.navigate('Registrar')}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" style={styles.iconoBoton} />
          <Text style={styles.botonTexto}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justify: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    // Sombra para iOS y Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ebf5fb',
    justify: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resaltado: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  botonVolver: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justify: 'center',
  },
  iconoBoton: {
    marginRight: 8,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
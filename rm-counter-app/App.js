import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

export default function App() {
  // 1. Estado para guardar la lista de eventos arrancando como arreglo vacio
  const [historial, setHistorial] = useState([]);

  // Funcion que se ejecuta al presionar el boton
  const registrarEvento = () => {
    const ahora = new Date();

    // Formateamos la fecha y hora para que quede legible (DD/MM/AAAA HH:MM:SS)
    const fechaHoraFormateada = ahora.toLocaleString('es-AR');

    // Creamos el nuevo evento con un ID único basado en el tiempo
    const nuevoEvento = {
      id: ahora.getTime().toString(),
      fecha: fechaHoraFormateada,
    };

    // Agregamos el nuevo evento al principio del arreglo para mantener el orden descendente
    setHistorial([nuevoEvento, ...historial]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrador de Eventos</Text>
      
      <View style={styles.botonCointainer}>
        <Button title="Registrar Evento" onPress={registrarEvento} color="#3498db"/>
      </View>

      <Text style={styles.subtitulo}>Historial:</Text>
      
      {/* FlatList renderiza la lista de forma eficiente */}
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.tarjetaEvento}>
            <Text style={styles.textoEvento}>
              Evento #{historial.length - index}: {item.fecha}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>No hay eventos registrados aún.</Text>
        }
        style={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  botonContainer: {
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 18,
    fonttWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  lista: {
    flex: 1,
  },
  tarjetaEvento: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom:10,
    borderLeftWidth: 5,
    borderLeftColor: '#2ecc71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textoEvento: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
  textoVacio: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  }
});
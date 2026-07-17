import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  // 1. Estado para guardar la lista de eventos arrancando como arreglo vacio
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Apuntamos a una colección llamada "eventosCompartidos" ordenando por fecha descendente
    const q = query(collection(db, "eventosCompartidos"), orderBy("timestamp", "desc"));

    // onSnapshot se queda "escuchando". Si otro usuario agrega un evento, tu pantalla se actualiza sola al toque
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventos = [];
      querySnapshot.forEach((doc) => {
        eventos.push({ id: doc.id, ...doc.data() });
      });
      setHistorial(eventos);
    });

    // Desconectamos el escuchador cuando la app se cierra
    return () => unsubscribe();
  }, []);

  // Funcion que se ejecuta al presionar el boton
  const registrarEvento = async () => {
    const ahora = new Date();

    // Formateamos la fecha y hora para que quede legible (DD/MM/AAAA HH:MM:SS)
    const fechaHoraFormateada = ahora.toLocaleString('es-AR');

    try {
      await addDoc(collection(db, "eventosCompartidos"), {
        fecha: fechaHoraFormateada,
        timestamp: ahora.getTime() // Lo usamos para ordenar bien
      });
    } catch (e) {
      console.error("Error al guardar en la nube: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrador de Eventos</Text>
      
      <View style={styles.botonCointainer}>
        <Button title="Registrar Evento" onPress={registrarEvento} color="#e67e22"/>
      </View>

      <Text style={styles.subtitulo}>Historial:</Text>
      
      {/* FlatList renderiza la lista de forma eficiente */}
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.tarjetaEvento}>
            <Text style={styles.textoEvento}>
              Evento: {item.fecha}
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
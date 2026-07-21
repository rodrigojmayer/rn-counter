import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
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
  const [tiposEvento, setTiposEvento] = useState([]); // Ahora viene de la base de datos
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [nuevoTipoTexto, setNuevoTipoTexto] = useState(''); // Estado para el input
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Escuchar Historial de Eventos
    const qHistorial = query(collection(db, "eventosCompartidos"), orderBy("timestamp", "desc"));
    const unsubscribeHistorial = onSnapshot(qHistorial, (querySnapshot) => {
      const eventos = [];
      querySnapshot.forEach((doc) => {
        eventos.push({ id: doc.id, ...doc.data() });
      });
      setHistorial(eventos);
    });

    // Escuchar Tipos de Eventos Creados (ordenados alfabéticamente)
    const qTipos = query(collection(db, "tiposEventos"), orderBy("nombre", "asc"));
    const unsubscribeTipos = onSnapshot(qTipos, (querySnapshot) => {
      const tipos = [];
      querySnapshot.forEach((doc) => {
        tipos.push({ id: doc.id, ...doc.data() });
      });
      setTiposEvento(tipos);
      
      // Si el tipo actualmente seleccionado fue eliminado, resetear al primero de la lista
      if (tipos.length > 0) {
        const existe = tipos.some(t => t.nombre === tipoSeleccionado);
        if (!existe) {
          setTipoSeleccionado(tipos[0].nombre);
        }
      } else {
        setTipoSeleccionado('');
      }
    });

    return () => {
      unsubscribeHistorial();
      unsubscribeTipos();
    };
  }, [tipoSeleccionado]);

  // 2. Crear un nuevo TIPO de evento en la nube
  const crearNuevoTipo = async () => {
    if (!nuevoTipoTexto.trim()) return;

    try {
      await addDoc(collection(db, "tiposEventos"), {
        nombre: nuevoTipoTexto.trim()
      });
      setTipoSeleccionado(nuevoTipoTexto.trim()); // Lo dejamos seleccionado
      setNuevoTipoTexto(''); // Limpiamos el input
    } catch (e) {
      console.error("Error al crear el tipo de evento: ", e);
    }
  };

  // Función para eliminar un tipo de evento de Firestore
  const eliminarTipo = (id, nombre) => {
    Alert.alert(
      "Eliminar tipo",
      `¿Estás seguro de que querés eliminar "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "tiposEventos", id));
            } catch (e) {
              console.error("Error al eliminar el tipo: ", e);
            }
          }
        }
      ]
    );
  };

  // 3. Registrar un evento en el historial
  const registrarEvento = async () => {
    if (!tipoSeleccionado) return;

    const ahora = new Date();
    const fechaHoraFormateada = ahora.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    try {
      await addDoc(collection(db, "eventosCompartidos"), {
        tipo: tipoSeleccionado,
        fecha: fechaHoraFormateada,
        timestamp: ahora.getTime()
      });
    } catch (e) {
      console.error("Error al guardar el evento: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrador de Eventos</Text>
      
      {/* SECCIÓN A: CREAR NUEVA CATEGORÍA */}
      <Text style={styles.seccionEtiqueta}>Añadir nuevo tipo de evento:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Gotas Vitaminas, Pañal, Cuna..."
          value={nuevoTipoTexto}
          onChangeText={setNuevoTipoTexto}
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={crearNuevoTipo}>
          <Text style={styles.botonAgregarTexto}>+</Text>
        </TouchableOpacity>
        </View>

      {/* LISTA DESPLEGABLE (SELECTOR) */}
      <Text style={styles.seccionEtiqueta}>Seleccionar tipo:</Text>
      <TouchableOpacity 
        style={styles.desplegableBoton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.desplegableTexto}>
          {tipoSeleccionado || "Elegir un tipo de evento..."}
        </Text>
        <Text style={styles.flecha}>▼</Text>
      </TouchableOpacity>
      
      {/* MODAL DESPLEGABLE */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOcultarFondo}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
              >
                <View style={styles.modalContenido}>
                  <Text style={styles.modalTitulo}>Selecciona un tipo</Text>
                  <FlatList
                    data={tiposEvento}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={[
                        styles.opcionFila, 
                        item.nombre === tipoSeleccionado && styles.opcionSeleccionada
                      ]}>
                        {/* Tocar el nombre selecciona el tipo */}
                      <TouchableOpacity
                        style={styles.opcionTextoArea}
                        onPress={() => {
                          setTipoSeleccionado(item.nombre);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.opcionTexto,
                          item.nombre === tipoSeleccionado && styles.opcionTextoSeleccionada
                        ]}>
                          {item.nombre}
                        </Text>
                      </TouchableOpacity>
                      {/* Botón para eliminar el tipo */}
                      <TouchableOpacity 
                        style={styles.botonEliminar} 
                        onPress={() => eliminarTipo(item.id, item.nombre)}
                      >
                        <Text style={styles.textoEliminar}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.textoVacioModal}>No hay tipos de eventos cargados.</Text>
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>

      {/* SECCIÓN C: BOTÓN DE REGISTRO */}
      <View style={styles.botonContainer}>
        <Button 
          title={tipoSeleccionado ? `Registrar ${tipoSeleccionado}` : "Seleccioná o creá un tipo"} 
          onPress={registrarEvento} 
          color="#2ecc71"
          disabled={!tipoSeleccionado}
        />
      </View>

      <Text style={styles.subtitulo}>Historial:</Text>
      
      {/* FlatList renderiza la lista de forma eficiente */}
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjetaEvento}>
            <Text style={styles.textoTipo}>{item.tipo || '📌 Evento'}</Text>
            <Text style={styles.textoFecha}>{item.fecha}</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  seccionEtiqueta: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#7f8c8d', 
    marginBottom: 8, 
    textTransform: 'uppercase' 
  },
  
  // Estilos del Input para agregar categorías
  inputContainer: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    gap: 10 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#dcdde1', 
    fontSize: 16 
  },
  botonAgregar: { 
    backgroundColor: '#3498db', 
    width: 46, 
    height: 46, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  botonAgregarTexto: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },

  desplegableBoton: {
    backgroundColor: '#ffffff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8,
    borderWidth: 1, borderColor: '#dcdde1', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20
  },
  desplegableTexto: { fontSize: 16, color: '#2c3e50', fontWeight: '600' },
  flecha: { fontSize: 12, color: '#7f8c8d' },

  // Estilos del Modal
  modalOcultarFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContenido: { backgroundColor: '#fff', width: '100%', maxHeight: '50%', borderRadius: 12, padding: 20, elevation: 5 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50', textAlign: 'center' },
  opcionFila: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    borderBottomWidth: 1, borderBottomColor: '#f1f2f6', paddingVertical: 8 
  },
  opcionSeleccionada: { backgroundColor: '#e8f8f5', borderRadius: 6 },
  opcionTextoArea: { flex: 1, paddingVertical: 8, paddingHorizontal: 8 },
  opcionTexto: { fontSize: 16, color: '#2c3e50' },
  opcionTextoSeleccionada: { fontWeight: 'bold', color: '#2ecc71' },
  
  botonEliminar: { padding: 8 },
  textoEliminar: { fontSize: 16 },
  textoVacioModal: { textAlign: 'center', color: '#95a5a6', marginVertical: 15, fontStyle: 'italic' },
  
  botonContainer: { 
    marginBottom: 25 
  },
  subtitulo: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: 12 
  },
  lista: { flex: 1 },
  tarjetaEvento: {
    backgroundColor: '#ffffff', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 1
  },
  textoTipo: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#2c3e50' 
  },
  textoFecha: { 
    fontSize: 13, 
    color: '#7f8c8d' 
  },
  textoVacio: { 
    textAlign: 'center', 
    color: '#95a5a6', 
    marginTop: 15, 
    fontSize: 15, 
    fontStyle: 'italic' 
  },
});
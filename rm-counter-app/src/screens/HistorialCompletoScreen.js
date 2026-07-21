import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export default function HistorialCompletoScreen() {
  const [historial, setHistorial] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  const [editTipo, setEditTipo] = useState('');
  const [editFecha, setEditFecha] = useState('');

  useEffect(() => {
    const qHistorial = query(collection(db, 'eventosCompartidos'), orderBy('timestamp', 'desc'));
    const unsubHistorial = onSnapshot(qHistorial, (snapshot) => {
      setHistorial(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const qTipos = query(collection(db, 'tiposEventos'), orderBy('nombre', 'asc'));
    const unsubTipos = onSnapshot(qTipos, (snapshot) => {
      setTiposEvento(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubHistorial();
      unsubTipos();
    };
  }, []);

  const abrirEdicion = (item) => {
    setEventoAEditar(item);
    setEditTipo(item.tipo || '');
    setEditFecha(item.fecha || '');
    setModalEditarVisible(true);
  };

  const guardarEdicion = async () => {
    if (!eventoAEditar) return;
    try {
      await updateDoc(doc(db, 'eventosCompartidos', eventoAEditar.id), {
        tipo: editTipo,
        fecha: editFecha
      });
      setModalEditarVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  const eliminarEvento = (id) => {
    Alert.alert('Eliminar registro', '¿Borrar este evento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: async () => await deleteDoc(doc(db, 'eventosCompartidos', id))
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial Completo</Text>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjetaEvento}>
            <View style={styles.tarjetaInfo}>
              <Text style={styles.textoTipo}>{item.tipo}</Text>
              <Text style={styles.textoFecha}>{item.fecha}</Text>
            </View>
            <View style={styles.accionesFila}>
              <TouchableOpacity style={styles.iconBoton} onPress={() => abrirEdicion(item)}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBoton} onPress={() => eliminarEvento(item.id)}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalEditarVisible} transparent animationType="slide">
        <View style={styles.modalOcultarFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Editar Registro</Text>
            <Text style={styles.inputEtiqueta}>Tipo:</Text>
            <FlatList
              data={tiposEvento}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 120 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.opcionFilaEdicion,
                    item.nombre === editTipo && styles.opcionEdicionSeleccionada
                  ]}
                  onPress={() => setEditTipo(item.nombre)}
                >
                  <Text style={styles.opcionTexto}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.inputEtiqueta}>Fecha / Hora:</Text>
            <TextInput style={styles.inputModal} value={editFecha} onChangeText={setEditFecha} />
            <View style={styles.modalBotonesFila}>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCancelar]}
                onPress={() => setModalEditarVisible(false)}
              >
                <Text style={styles.modalBotonTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonGuardar]}
                onPress={guardarEdicion}
              >
                <Text style={styles.modalBotonTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f6fa', 
        padding: 20 
    },
    titulo: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#2c3e50', 
        marginBottom: 15 
    },
    tarjetaEvento: { 
        backgroundColor: '#fff', 
        padding: 14, 
        borderRadius: 8, 
        marginBottom: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    tarjetaInfo: { 
        flex: 1 
    },
    textoTipo: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#2c3e50' 
    },
    textoFecha: { 
        fontSize: 12, 
        color: '#7f8c8d' 
    },
    accionesFila: { 
        flexDirection: 'row', 
        gap: 10 
    },
    iconBoton: { 
        padding: 4 
    },
    modalOcultarFondo: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    modalContenido: { 
        backgroundColor: '#fff', 
        width: '100%', 
        borderRadius: 12, 
        padding: 20 
    },
    modalTitulo: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    opcionTexto: { 
        fontSize: 15, 
        color: '#2c3e50' 
    },
    inputEtiqueta: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        color: '#7f8c8d', 
        marginTop: 10, 
        marginBottom: 4 
    },
    inputModal: { 
        backgroundColor: '#f8f9fa', 
        padding: 8, 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#dcdde1' 
    },
    opcionFilaEdicion: { 
        padding: 8, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    opcionEdicionSeleccionada: { 
        backgroundColor: '#e8f8f5' 
    },
    modalBotonesFila: { 
        flexDirection: 'row', 
        marginTop: 15, 
        gap: 10 
    },
    modalBoton: { 
        flex: 1, 
        padding: 10, 
        borderRadius: 6, 
        alignItems: 'center' 
    },
    modalBotonCancelar: { 
        backgroundColor: '#95a5a6' 
    },
    modalBotonGuardar: { 
        backgroundColor: '#2ecc71' 
    },
    modalBotonTexto: { 
        color: '#fff', 
        fontWeight: 'bold' 
    }
});
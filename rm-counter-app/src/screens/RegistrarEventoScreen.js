import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

export default function RegistrarEventoScreen({ navigation }) {
  const [tiposEvento, setTiposEvento] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [nuevoTipoTexto, setNuevoTipoTexto] = useState('');
  const [ultimosEventos, setUltimosEventos] = useState([]);
  const [modalTiposVisible, setModalTiposVisible] = useState(false);

  useEffect(() => {
    const qTipos = query(collection(db, 'tiposEventos'), orderBy('nombre', 'asc'));
    const unsubscribeTipos = onSnapshot(qTipos, (snapshot) => {
      const tipos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTiposEvento(tipos);
      if (tipos.length > 0 && !tipoSeleccionado) {
        setTipoSeleccionado(tipos[0].nombre);
      }
    });

    const qUltimos = query(
      collection(db, 'eventosCompartidos'),
      orderBy('timestamp', 'desc'),
      limit(3)
    );
    const unsubscribeUltimos = onSnapshot(qUltimos, (snapshot) => {
      const eventos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUltimosEventos(eventos);
    });

    return () => {
      unsubscribeTipos();
      unsubscribeUltimos();
    };
  }, []);

  const crearNuevoTipo = async () => {
    if (!nuevoTipoTexto.trim()) return;
    try {
      await addDoc(collection(db, 'tiposEventos'), { nombre: nuevoTipoTexto.trim() });
      setTipoSeleccionado(nuevoTipoTexto.trim());
      setNuevoTipoTexto('');
    } catch (e) {
      console.error(e);
    }
  };

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
      await addDoc(collection(db, 'eventosCompartidos'), {
        tipo: tipoSeleccionado,
        fecha: fechaHoraFormateada,
        timestamp: ahora.getTime()
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nuevo Registro</Text>

      <Text style={styles.seccionEtiqueta}>Añadir tipo de evento:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Gotas, Pañal..."
          value={nuevoTipoTexto}
          onChangeText={setNuevoTipoTexto}
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={crearNuevoTipo}>
          <Text style={styles.botonAgregarTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.seccionEtiqueta}>Seleccionar tipo:</Text>
      <TouchableOpacity
        style={styles.desplegableBoton}
        onPress={() => setModalTiposVisible(true)}
      >
        <Text style={styles.desplegableTexto}>
          {tipoSeleccionado || 'Elegir tipo...'}
        </Text>
        <Text style={styles.flecha}>▼</Text>
      </TouchableOpacity>

      <View style={styles.botonContainer}>
        <Button
          title={tipoSeleccionado ? `Registrar ${tipoSeleccionado}` : 'Seleccionar tipo'}
          onPress={registrarEvento}
          color="#2ecc71"
          disabled={!tipoSeleccionado}
        />
      </View>

      <View style={styles.seccionHeader}>
        <Text style={styles.subtitulo}>Últimos registros</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HistorialCompleto')}>
          <Text style={styles.linkVerTodo}>Ver todo →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ultimosEventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjetaEventoResumen}>
            <Text style={styles.textoTipo}>{item.tipo}</Text>
            <Text style={styles.textoFecha}>{item.fecha}</Text>
          </View>
        )}
      />

      <Modal visible={modalTiposVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOcultarFondo}
          activeOpacity={1}
          onPress={() => setModalTiposVisible(false)}
        >
          <View style={styles.modalContenido}>
            <FlatList
              data={tiposEvento}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.opcionFila}
                  onPress={() => {
                    setTipoSeleccionado(item.nombre);
                    setModalTiposVisible(false);
                  }}
                >
                  <Text style={styles.opcionTexto}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
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
    seccionEtiqueta: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: '#7f8c8d', 
        marginBottom: 6 
    },
    inputContainer: { 
        flexDirection: 'row', 
        marginBottom: 15, 
        gap: 10 
    },
    input: { 
        flex: 1, 
        backgroundColor: '#fff', 
        paddingHorizontal: 12, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#dcdde1' 
    },
    botonAgregar: { 
        backgroundColor: '#3498db', 
        width: 44, 
        height: 44, 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    botonAgregarTexto: { 
        color: '#fff', 
        fontSize: 22, 
        fontWeight: 'bold' 
    },
    desplegableBoton: { 
        backgroundColor: '#fff', 
        padding: 12, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#dcdde1', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 15 
    },
    desplegableTexto: { 
        fontSize: 15, 
        color: '#2c3e50' 
    },
    flecha: { 
        color: '#7f8c8d' 
    },
    botonContainer: { 
        marginBottom: 20 
    },
    seccionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 10 
    },
    subtitulo: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#2c3e50' 
    },
    linkVerTodo: { 
        color: '#3498db', 
        fontWeight: 'bold' 
    },
    tarjetaEventoResumen: { 
        backgroundColor: '#fff', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 8, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
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
    opcionFila: { 
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f1f2f6' 
    },
    opcionTexto: { 
        fontSize: 15, 
        color: '#2c3e50' 
    }
});
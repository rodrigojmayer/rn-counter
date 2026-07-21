import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AgregarTipoScreen({ navigation }) {
  const [nuevoTipoTexto, setNuevoTipoTexto] = useState('');

  const guardarTipo = async () => {
    if (!nuevoTipoTexto.trim()) {
      Alert.alert('Atención', 'Ingresá el nombre del evento');
      return;
    }

    try {
      await addDoc(collection(db, 'tiposEventos'), {
        nombre: nuevoTipoTexto.trim()
      });
      setNuevoTipoTexto('');
      // Volvemos a la pantalla de registro
      navigation.navigate('Registrar');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo guardar el tipo de evento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nuevo Tipo de Evento</Text>
      
      <Text style={styles.seccionEtiqueta}>Nombre del evento / acción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Gotas, Pañal, Teta, Creadi..."
        value={nuevoTipoTexto}
        onChangeText={setNuevoTipoTexto}
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardarTipo}>
        <Text style={styles.botonGuardarTexto}>Guardar Tipo</Text>
      </TouchableOpacity>
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
        marginBottom: 20 
    },
    seccionEtiqueta: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: '#7f8c8d', 
        marginBottom: 8 
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dcdde1',
        fontSize: 15,
        marginBottom: 20
    },
    botonGuardar: {
        backgroundColor: '#3498db',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    botonGuardarTexto: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});
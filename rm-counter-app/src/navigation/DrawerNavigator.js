import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import RegistrarEventoScreen from '../screens/RegistrarEventoScreen';
import HistorialCompletoScreen from '../screens/HistorialCompletoScreen';
import AgregarTipoScreen from '../screens/AgregarTipoScreen';
import EnConstruccionScreen from '../screens/EnConstruccionScreen';

const Drawer = createDrawerNavigator();

// Componente personalizado para el Header y el menú lateral
function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      {/* Cabecera superior con Logo y Nombre */}
      <View style={styles.headerContainer}>
        <View style={styles.logoCircle}>
          <Ionicons style={styles.logoIcon} name="time-outline" size={26} color="#fff" />
        </View>
        <Text style={styles.appName}>Registro de actividades</Text>
      </View>

      {/* Lista con los ítems de navegación */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Registrar"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'front',
        headerStyle: { backgroundColor: '#34495e' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#1a365d', width: 280 },
        drawerActiveBackgroundColor: 'rgba(255, 255, 255, 0.15)',
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: '#a0aec0',
        drawerLabelStyle: { fontSize: 15, fontWeight: '500', marginLeft: -10 }
      }}
    >
      <Drawer.Screen
        name="Registrar"
        component={RegistrarEventoScreen}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="AgregarTipo"
        component={AgregarTipoScreen}
        options={{
          title: 'Añadir Tipo de Evento',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="HistorialCompleto"
        component={HistorialCompletoScreen}
        options={{
          title: 'Historial Completo',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          )
        }}
      />

      {/* Pantallas futuras en desarrollo */}
      <Drawer.Screen
        name="Perfil"
        component={EnConstruccionScreen}
        initialParams={{ titulo: 'Perfil' }}
        options={{
          title: 'Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="Grupo"
        component={EnConstruccionScreen}
        initialParams={{ titulo: 'Grupo' }}
        options={{
          title: 'Grupo',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="Configuración"
        component={EnConstruccionScreen}
        initialParams={{ titulo: 'Configuración' }}
        options={{
          title: 'Ajustes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="Estadisticas"
        component={EnConstruccionScreen}
        initialParams={{ titulo: 'Estadísticas y Reportes' }}
        options={{
          title: 'Estadísticas',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#1a365d'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)'
    },
    logoCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#3182ce',
        justify: 'center',
        alignItems: 'center',
        marginRight: 10,
        position: 'relative', // Para asegurar el contenedor de referencia
    },
    logoIcon: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 38, // Debe ser exactamente el mismo alto que el logoCircle (38)
    },
    appName: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    scrollContainer: {
        paddingTop: 10
    }
});
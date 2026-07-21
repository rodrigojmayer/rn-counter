import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegistrarEventoScreen from '../screens/RegistrarEventoScreen';
import HistorialCompletoScreen from '../screens/HistorialCompletoScreen';
import AgregarTipoScreen from '../screens/AgregarTipoScreen';
import EnConstruccionScreen from '../screens/EnConstruccionScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Registrar"
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'front',
        headerStyle: { backgroundColor: '#34495e' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2ecc71',
        drawerInactiveTintColor: '#7f8c8d'
      }}
    >
        <Drawer.Screen
            name="Registrar"
            component={RegistrarEventoScreen}
            options={{ title: 'Inicio' }}
        />
        <Drawer.Screen
            name="AgregarTipo"
            component={AgregarTipoScreen}
            options={{ title: 'Añadir Tipo de Evento' }}
        />
        <Drawer.Screen
            name="HistorialCompleto"
            component={HistorialCompletoScreen}
            options={{ title: 'Historial Completo' }}
        />
        {/* Pantallas futuras en desarrollo */}
        <Drawer.Screen
            name="Perfil"
            component={EnConstruccionScreen}
            initialParams={{ titulo: 'Perfil' }}
            options={{ title: 'Perfil' }}
        />
        <Drawer.Screen
            name="Grupo"
            component={EnConstruccionScreen}
            initialParams={{ titulo: 'Grupo' }}
            options={{ title: 'Grupo' }}
        />
        <Drawer.Screen
            name="Configuración"
            component={EnConstruccionScreen}
            initialParams={{ titulo: 'Configuración' }}
            options={{ title: 'Ajustes' }}
        />
        <Drawer.Screen
            name="Estadisticas"
            component={EnConstruccionScreen}
            initialParams={{ titulo: 'Estadísticas y Reportes' }}
            options={{ title: 'Estadísticas' }}
        />
    </Drawer.Navigator>
  );
}
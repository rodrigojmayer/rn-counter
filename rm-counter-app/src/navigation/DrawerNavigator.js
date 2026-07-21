import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegistrarEventoScreen from '../screens/RegistrarEventoScreen';
import HistorialCompletoScreen from '../screens/HistorialCompletoScreen';
import AgregarTipoScreen from '../screens/AgregarTipoScreen';

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
        options={{ title: 'Registrar Evento' }}
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
    </Drawer.Navigator>
  );
}
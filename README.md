# 📱 RM Counter App

Aplicación móvil y web para la gestión y seguimiento de contadores, desarrollada con **React Native** y el ecosistema **Expo**.

---

## 🚀 Tecnologías Utilizadas

* **Framework Principal:** [React Native](https://reactnative.dev/) (SDK 54) con [Expo](https://expo.dev/)
* **Lenguaje:** JavaScript / JSX
* **Base de Datos & Backend:** [Firebase](https://firebase.google.com/) (Auth / Firestore / Realtime DB)
* **Compatibilidad Web:** `react-native-web` & `react-dom`
* **Compilación & Builds:** Expo Application Services (EAS Build)

---

## 🛠️ Requisitos Previos

Asegurate de tener instalado en tu entorno de desarrollo:

* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* [npm](https://www.npmjs.com/)
* CLI de EAS (para compilar APKs): `npm install -g eas-cli`
* Cuenta activa en [Expo.dev](https://expo.dev)

---

## 📦 Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/rm-counter-app.git](https://github.com/tu-usuario/rm-counter-app.git)
   cd rm-counter-app
Instalar dependencias:

Bash
npm install
Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto con las credenciales de Firebase:  

Fragmento de código
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
💻 Desarrollo
Ejecutar en desarrollo móvil (Expo Go):

Bash
npx expo start
Escaneá el código QR con la app de cámara en iOS o desde Expo Go en Android.

Ejecutar en el navegador web:

Bash
npx expo start --web
Accedé desde tu celular o PC usando la IP local que muestra la terminal.

🏗️ Compilación y Despliegue (EAS Build)
🤖 Generar APK ejecutable para Android
Para generar un instalador .apk independiente que no requiera Expo Go:

Iniciar sesión en EAS:

Bash
eas login
Lanzar la build en la nube:

Bash
eas build --platform android --profile preview
Instalación en el dispositivo:

Una vez finalizado el proceso en Expo, descargá el .apk directo al teléfono o pasalo por USB/Enlace Móvil.

Habilitá la opción de "Instalar aplicaciones de fuentes desconocidas" en Android e instalalo.

💡 Nota: Si necesitás limpiar el caché de compilación en la nube antes de generar la build, usá la bandera --clear-cache:

Bash
eas build --platform android --profile preview --clear-cache
📱 Probar en iOS (iPhone)
Debido a las políticas de firmado de Apple, existen dos formas de probar la aplicación en iOS:

Vía Expo Go (Gratuito): Correr npx expo start y escanear el QR desde la app de cámara.

Vía Web (PWA): Correr npx expo start --web, abrir la IP local desde Safari en el iPhone y seleccionar "Agregar a inicio".
# 🎯 modelo3D – Visualizador 3D Interactivo para Pantalla Táctil

Este proyecto es una demo interactiva pensada para entornos de retail o showrooms, donde el usuario puede visualizar un modelo 3D en pantalla táctil.  
Está desarrollado en tecnologías web modernas con **renderizado en tiempo real**, preparado para ser desplegado en una tienda física o tótem digital.

Ideal para experiencias de marca, productos interactivos o probadores virtuales.

---

## 🧠 Funcionalidades clave

✅ Visualización 3D de producto desde navegador  
✅ Interfaz diseñada para interacción táctil  
✅ Experiencia ligera, rápida y responsiva  
✅ Preparado para integración con WebSocket o API externa  
✅ Soporte para despliegue en **Firebase Hosting**

---

## ⚙️ Tecnologías utilizadas

- 💻 JavaScript (vanilla + módulos)
- ⚙️ Vite.js (build & dev server)
- 🎨 HTML / CSS
- 📦 Firebase (hosting)
- ✨ Preparado para cargar modelos `.glb` o `.gltf` en versiones futuras

---

---
▶️ Cómo ejecutar localmente
🔹 Requisitos:
Tener Node.js instalado

Un navegador moderno

🔸 Instrucciones:
Cloná el repositorio:

bash
Copy
Edit
git clone https://github.com/JuliMart/modelo3D.git
cd modelo3D
Instalá las dependencias:

bash
Copy
Edit
npm install
Ejecutá el servidor local:

bash
Copy
Edit
npm run dev
Accedé al proyecto desde tu navegador en:

arduino
Copy
Edit
http://localhost:5173/
🌐 Cómo desplegar en Firebase Hosting
Instalá la CLI de Firebase (si no la tenés):

bash
Copy
Edit
npm install -g firebase-tools
Iniciá el proyecto de Firebase en esta carpeta:

bash
Copy
Edit
firebase init
Cuando te pregunte qué configurar, elegí: Hosting
Asegurate de seleccionar dist/ o build/ como directorio (según cómo esté configurado Vite)

Hacé el deploy:

bash
Copy
Edit
firebase deploy
Al terminar, Firebase te dará una URL pública como https://modelo3d-demo.web.app

🛍️ Contexto de uso
Este proyecto está pensado para:

🛒 Retail interactivo (zapatillas, ropa, accesorios)

💼 Ferias tecnológicas o exposiciones

🖥️ Showrooms físicos o digitales

🪟 Escaparates o vitrinas con pantallas táctiles

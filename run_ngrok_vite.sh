
#!/bin/bash

# Verifica si ngrok está instalado
if ! command -v ngrok &> /dev/null
then
    echo "❌ ngrok no está instalado. Instalalo desde https://ngrok.com/download o ejecuta:"
    echo "npm install -g ngrok"
    exit 1
fi

echo "🚀 Iniciando Vite en segundo plano..."
npm run dev &

sleep 2
echo "🌐 Exponiendo localhost:8080 con ngrok..."
ngrok http 8080

# 🚀 Mème Launcher

Envoie des mèmes en live sur l'écran de ton pote via WebSocket (Socket.io).

## Installation & lancement en local

```bash
npm install
npm start
```

Puis ouvre :
- **Toi (sender)** → http://localhost:3000/sender.html
- **Ton pote (viewer)** → http://localhost:3000/viewer.html

Le sender copie et envoie le lien viewer à son pote — même room automatique.

## Déploiement gratuit sur Railway

1. Crée un compte sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Push ce dossier sur GitHub d'abord
4. Railway détecte `package.json` et lance `npm start` tout seul
5. Tu obtiens une URL publique genre `https://meme-launcher-xxx.up.railway.app`

### Ou sur Render (aussi gratuit)

1. Compte sur [render.com](https://render.com)
2. "New Web Service" → connecte ton repo GitHub
3. Build command : `npm install`
4. Start command : `npm start`

## Fonctionnalités

- 12 mèmes emoji prédéfinis
- Upload d'images custom (JPG, PNG, GIF)
- Texte personnalisé sur l'écran
- Sons troll : Airhorn, Vine boom, Bruh, Pet 💨
- Flash + shake sur l'écran du viewer à chaque mème
- Rooms isolées via `?room=CODE`
- Compteur de viewers en temps réel
- Historique des envois côté sender

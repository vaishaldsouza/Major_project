# 🌾 Farm Marketplace Mobile App (Expo)

## 📌 Project Overview

This is a **React Native mobile application** built using **Expo** for a blockchain-based **Farm Marketplace** system.

The goal is to connect farmers and buyers directly through a mobile platform.

---

## 🚀 Tech Stack

* React Native (Expo)
* TypeScript
* Node.js (for development environment)
* Future: Blockchain integration

---

## 🛠️ Prerequisites

Make sure you have the following installed:

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* VS Code (recommended editor)
* Expo Go app on your mobile device (Android/iOS)

---

## 📥 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/pruthvimax/Major_project
cd farm-marketplace
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Start the Development Server

```bash
npx expo start
```

---

### 4. Run on Mobile 📱

* Install **Expo Go** from Play Store / App Store
* Make sure your phone and laptop are on the **same WiFi**
* Scan the QR code shown in terminal/browser

---

## 📁 Project Structure

```
farm-marketplace/
│── assets/          # Images, icons
│── components/      # Reusable UI components
│── screens/         # App screens (Login, Dashboard, etc.)
│── App.tsx          # Main entry point
│── package.json     # Dependencies
```

---

## 🧑‍💻 Development Guidelines

### 🔹 Coding

* Use **TypeScript (.tsx)** for all components
* Follow clean and readable code practices
* Use functional components only

---

### 🔹 Folder Rules

* Screens → inside `screens/`
* Reusable UI → inside `components/`

---

### 🔹 Naming Convention

* Components: `PascalCase` (e.g., `LoginScreen.tsx`)
* Variables: `camelCase`

---

## 📦 Installing New Packages

Whenever you install a new package:

```bash
npm install package-name
```

OR for Expo-compatible packages:

```bash
npx expo install package-name
```

👉 Always prefer `expo install` for compatibility.

---

## 🔄 Clearing Cache (Important)

If app behaves weird:

```bash
npx expo start -c
```

---

## ❗ Common Issues & Fixes

### QR Code not scanning

* Ensure same WiFi network
* Use:

```bash
npx expo start --tunnel
```

---

### App not updating

* Save file properly
* Reload app in Expo Go
* Clear cache (`-c`)

---

### Port already in use

```bash
npx expo start --port 3001
```

---

## 🤝 Team Workflow

### Before starting work:

```bash
git pull
npm install
```

### After changes:

```bash
git add .
git commit -m "your message"
git push
```

---

## 🎯 Current Goal (Phase 1)

* Setup Expo project
* Basic UI screens
* Navigation setup

---

## 🔮 Future Scope

* Blockchain integration
* Farmer product listing
* Buyer purchase system
* Secure transactions

---

## 👨‍💻 Contributors

* Pruthvi & Team

---

## 📌 Notes

* Do NOT commit `node_modules`
* Always test on mobile using Expo Go
* Keep code clean and modular

---

🔥 Let’s build something awesome!

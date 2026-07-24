# TinySteps AI 🌟 – AI-Powered Kids Learning App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-2.5_Flash-8E44AD?logo=google&logoColor=white)](https://ai.google.dev/)
[![Deploys on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://kids-learning-app-pink.vercel.app/)

An interactive, AI-driven educational platform designed for preschool and early childhood learners (ages 2–6+). Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**.

---

## 🎓 Academic Project Information

* **Project Title:** TinySteps AI – AI-Powered Kids Learning App
* **Project Category:** AI-Powered Educational Web Application
* **Developer:** Khadija Mazhar
* **Degree Program:** BS Information Technology (BS IT)
* **University:** National University of Modern Languages (NUML), Islamabad
* **Project Type:** Individual Final Project — *Ship Your AI App Evaluation*

---

## 📌 Project Links

* 🌐 **Live Application:** [https://kids-learning-app-pink.vercel.app/](https://kids-learning-app-pink.vercel.app/)
* 📦 **GitHub Repository:** [https://github.com/Khadija-76/Kids-learning-app](https://github.com/Khadija-76/Kids-learning-app)

---

## 🚀 Project Overview

**TinySteps AI** is an innovative educational web application engineered to transform early childhood learning into a playful, interactive, and personalized digital adventure. Designed specifically for young children between the ages of 2 and 6+, TinySteps AI combines playful visual design, audio-assisted pronunciation, interactive drawing canvases, Islamic learning modules, dynamic story generation, and a friendly AI companion mascot—**Tippy Owl**.

By leveraging **Google's Gemini 2.5 Flash AI model** via Google AI Studio, TinySteps AI simplifies learning concepts into age-appropriate, encouraging responses. It fosters early literacy, numeracy, language development, moral values, and creative expression within a safe, ad-free, and positive environment.

---

## 💡 Problem Statement

Early childhood education faces significant digital challenges:

1. **Static & Passive Learning:** Traditional learning platforms rely on rigid flashcards and pre-recorded videos that fail to adapt to a child's curiosity or pace.
2. **Short Attention Spans:** Passive reading and static screens often fail to keep toddlers engaged in fundamental concepts.
3. **Safety & Suitability Concerns:** Many online educational resources lack strict child safety guardrails, age-tailored explanations, or parent controls.

### How TinySteps AI Solves This Problem
TinySteps AI bridges this gap by offering a multi-sensory learning ecosystem powered by **Google Gemini AI**. Acting as a patient and encouraging digital tutor, Tippy Owl answers children's questions in simple words, generates bedtime stories using words learned that day, rewards progress with stars and magic coins, and provides interactive voice and canvas activities.

---

## 👥 Target Users

* 👧 **Children (Ages 2–6+):** Early childhood learners who benefit from visual, auditory, and gamified learning experiences.
* 👨‍👩‍👧 **Parents:** Parents seeking a safe, ad-free, wholesome digital environment for screen-time learning.
* 👩‍🏫 **Teachers & Educators:** Early childhood educators looking for interactive visual aids, story generation tools, and pronunciation modules.
* 🏫 **Kindergartens & Elementary Schools:** Educational institutions incorporating modern AI learning tools into early childhood curricula.

---

## ✨ Key Features

### 🦉 1. AI Learning Assistant (Tippy Owl)
Tippy Owl is an interactive digital mascot on the home screen and in learning modules. Tippy blinks, bounces, waves, and speaks encouraging motivational messages in real-time, guiding children through lessons with audio voice output.

### 👤 2. Personalized Child Profile
Parents and children can customize the child's name, age (2–6+), preferred avatar icon (Lion, Panda, Unicorn, Rocket, etc.), and learning language (English, Urdu, or Arabic).

### 🔤 3. Interactive Adventure Trail & Phonics
Structured learning levels covering letter recognition, numbers, object counting, colors, and shapes with star rating rewards upon completion.

### 🌙 4. Islamic Learning World
Includes Daily Duas (Bismillah, Sleeping, Eating, Waking Up), the 6 Kalmas with Arabic text, Urdu/English translations, audio recitations, and interactive quiz cards.

### 📖 5. AI Bedtime Story Generator
An AI-powered storybook generator where children tap words learned during lessons (e.g., *Mama, Baba, Apple, Star*) and choose characters to generate custom bedtime stories narrated with voice synthesis.

### 🎤 6. Voice & Pronunciation Practice (AI Voice Lab)
Speech-based vocabulary practice using browser-native Text-to-Speech and Speech Recognition. Tippy listens to children pronounce words and provides immediate visual and audio encouragement.

### 🎨 7. Magic AI Drawing & Tracing Canvas
An HTML5 canvas activity where children draw, trace shapes and letters, pick vibrant color palettes, adjust stroke sizes, and use an eraser.

### 🎁 8. Reward System & Treasure Shop
Children earn **Magic Stars** and **Magic Coins** by completing lessons and daily missions. Earned coins can be spent in the virtual Reward Shop to unlock sticker badges and treasure chests.

### 🛡️ 9. Parent Dashboard with Security Math Gate
Protected behind a parent security PIN math question, allowing parents to adjust audio settings, view learning statistics, and manage profile configurations.

---

## 🤖 AI Implementation & System Prompt

TinySteps AI incorporates **Google Gemini 2.5 Flash** using the official `@google/genai` SDK via secure Express server proxy endpoints (`/api/gemini/chat` and `/api/gemini/story`).

### 📝 AI System Prompt
Below is the system prompt configured for Tippy Owl in TinySteps AI:

```text
You are Tippy Owl 🦉, a gentle, joyful, and encouraging AI teacher for preschool children aged 2 to 6 years old.

CORE RESPONSIBILITIES:
1. Speak in warm, enthusiastic, and simple language using short sentences.
2. Limit all responses to 2–3 simple sentences maximum.
3. Always maintain a positive, nurturing, and praise-filled tone (e.g., "Great job!", "You are so clever!").
4. Explain real-world concepts using playful analogies (e.g., comparing clouds to fluffy cotton balls).
5. Never output adult concepts, scary topics, negative criticism, or complex academic terms.
6. Use child-friendly emojis (⭐, 🎈, 🌈, 🌸, 🦁, 📚) to make text visually engaging.
```

---

## 🛠️ Technology Stack

| Technology | Role / Category | Selection Rationale |
| :--- | :--- | :--- |
| **React 18** | Frontend Library | Component-based UI architecture enabling smooth reactive updates. |
| **TypeScript** | Language | Type safety and maintainability across all UI components and API models. |
| **Vite 5** | Build Tool | Fast Hot Module Replacement (HMR) and optimized build bundling. |
| **Tailwind CSS** | Styling | Utility-first styling for custom child-friendly color palettes and glassmorphism. |
| **Motion** | Animations | Smooth 60fps spring animations, tab transitions, and floating background effects. |
| **Google Gemini AI** | Artificial Intelligence | Generates age-appropriate explanations and custom educational stories. |
| **Express.js (Node.js)** | Backend Middleware | Serves API routes and securely proxies Gemini API calls. |
| **Lucide React** | Icons | Clean, accessible SVG icons designed for large child-friendly touch targets. |
| **GitHub** | Version Control | Source code repository and project management. |
| **Vercel** | Hosting & CDN | Global deployment platform with automated CI/CD integration. |

---

## 🏗️ Project Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
│  React 18 + TypeScript + Tailwind CSS + Framer Motion   │
│  - Adventure Map / Sky World    - Islamic World Module  │
│  - AI Storybook Generator       - AI Voice Lab & Canvas │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / REST API
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Server (Express Node.js)               │
│  - API Proxy Routes (/api/gemini/chat, /api/gemini/story)│
│  - Environment Variable Protection (GEMINI_API_KEY)     │
└────────────────────────────┬────────────────────────────┘
                             │ Google GenAI SDK (@google/genai)
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Google Gemini 2.5 Flash API               │
│  - Simple Kid-Friendly Explanations                     │
│  - Dynamic Moral & Educational Story Generation          │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
Kids-learning-app/
├── public/                     # Static public assets (icons, audio assets)
├── src/                        # Source code
│   ├── assets/                 # App images and mascot illustration references
│   ├── components/             # Reusable UI components
│   │   ├── AdventureMap.tsx    # Home screen, sky environment, daily goals, level path
│   │   ├── IslamicWorld.tsx    # Duas, 6 Kalmas, audio recitations, and quiz cards
│   │   ├── VideosTab.tsx       # 3D Animated video theater module
│   │   ├── VoiceTab.tsx        # Speak & pronunciation practice module
│   │   ├── DoodleCanvas.tsx    # Drawing canvas & tracing activity module
│   │   ├── StoryReader.tsx     # AI Story generator and bedtime reader
│   │   ├── RewardsTab.tsx      # Sticker reward shop and star collection
│   │   ├── ParentDashboard.tsx # Parent lock pin gate & progress overview
│   │   └── LessonModal.tsx     # Interactive step-by-step level modal
│   ├── utils/                  # Web Audio sound effects and speech synthesis helpers
│   ├── types.ts                # TypeScript interfaces and data models
│   ├── App.tsx                 # Main application state and bottom glass navigation
│   └── main.tsx                # Application DOM entry point
├── server.ts                   # Express backend server with Gemini API endpoints
├── package.json                # Project dependencies and script declarations
├── vite.config.ts              # Vite server and build settings
└── README.md                   # Project documentation
```

---

## ⚙️ Installation Guide

### Prerequisites
* **Node.js:** `v18.0.0` or higher
* **npm:** `v9.0.0` or higher
* **Gemini API Key:** Free API key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone Repository
```bash
git clone https://github.com/Khadija-76/Kids-learning-app.git
cd Kids-learning-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Step 5: Build Production Bundle
```bash
npm run build
```

---

## 🎮 How to Use the Application

1. **Select Child Profile:** Click **Profile** on the Home Screen to customize the child's name, age, avatar, and preferred language.
2. **Interact with Tippy Owl:** Tap Tippy Owl on the Home Screen to hear encouraging voice messages.
3. **Complete Today's Mission:** View daily goals for lessons completed, words practiced, and stories read.
4. **Explore Learning Worlds:** Use the floating glassmorphism navigation bar:
   * **Learn (🏠):** Follow the animated adventure path.
   * **Islamic (🌙):** Recite Duas and listen to the 6 Kalmas.
   * **Videos (🎬):** Watch 3D educational lessons.
   * **Speak (🎤):** Practice pronunciation in the AI Voice Lab.
   * **Activities (🎨):** Draw and trace on the Magic AI Canvas.
   * **Stories (📚):** Generate personalized AI bedtime stories.
   * **Rewards (🎁):** Spend earned coins in the Sticker Shop.
5. **Parent Dashboard:** Access parent controls via the lock icon at the top right.

---

## 🖼️ Application Screenshots

### 1. Home Dashboard & Adventure Map
![Home Dashboard](https://raw.githubusercontent.com/Khadija-76/Kids-learning-app/main/public/screenshots/home.png)
*(Home Screen featuring animated sky background, Tippy Owl mascot, daily goals, and adventure learning path)*

### 2. AI Voice Lab & Pronunciation Practice
![AI Voice Lab](https://raw.githubusercontent.com/Khadija-76/Kids-learning-app/main/public/screenshots/speak.png)
*(Voice and phonics practice module with Speech-to-Text feedback)*

### 3. AI Bedtime Story Generator
![AI Story Generator](https://raw.githubusercontent.com/Khadija-76/Kids-learning-app/main/public/screenshots/story.png)
*(Dynamic story generator creating custom moral stories using words learned during lessons)*

### 4. Magic AI Drawing Canvas
![Magic Canvas](https://raw.githubusercontent.com/Khadija-76/Kids-learning-app/main/public/screenshots/canvas.png)
*(Creative doodle canvas with color choices, stroke sizes, and tracing tools)*

### 5. Daily Treasure Chest & Reward Shop
![Reward Shop](https://raw.githubusercontent.com/Khadija-76/Kids-learning-app/main/public/screenshots/rewards.png)
*(Reward shop where children redeem earned coins for stickers and treasure chests)*

---

## 🔒 Security & Privacy

* **API Key Protection:** The Google Gemini API key is stored strictly in server-side environment variables (`GEMINI_API_KEY`) and is never exposed in browser bundles.
* **Child Safety First:** TinySteps AI does not collect personal data or location tracking, ensuring COPPA-compliant early learning safety.

---

## 🔮 Future Improvements

1. **Voice-Based Conversational AI:** Real-time natural voice conversations with Tippy Owl using Gemini Live API.
2. **Parent Analytics Dashboard:** Visual progress charts tracking time spent and subject mastery.
3. **Teacher Portal:** Classroom management tools for educators to assign lessons.
4. **Offline Mode (PWA Support):** Progressive web caching for learning without internet connectivity.
5. **Multi-Language Expansion:** Extended support for French, Spanish, Hindi, and Mandarin.
6. **Adaptive AI Quiz Engine:** Dynamic quizzes generated based on identified weak areas.
7. **Augmented Reality (AR) Cards:** 3D animals and letters projected into physical environments.
8. **Cloud Progress Sync:** User authentication to sync stars and coins across devices.

---

## 🚀 Deployment

* **Hosting Platform:** Vercel
* **Live Application URL:** [https://kids-learning-app-pink.vercel.app/](https://kids-learning-app-pink.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Khadija Mazhar**  
BS Information Technology  
National University of Modern Languages (NUML), Islamabad, Pakistan  
GitHub: [@Khadija-76](https://github.com/Khadija-76)  
Project Repository: [https://github.com/Khadija-76/Kids-learning-app](https://github.com/Khadija-76/Kids-learning-app)

---

<p align="center">
  Made with ❤️, ✨, and 🦉 for little learners everywhere!
</p>

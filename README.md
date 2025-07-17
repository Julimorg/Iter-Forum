# 📘 Iter Forum

A modern educational forum platform built with **React**, **TypeScript**, and **Vite**. This project offers a sleek, responsive, and interactive UI with advanced features such as rich text editing, real-time interactions (via socket), and user-friendly navigation, tailored for educational and discussion purposes.

## 🚀 Tech Stack

* **Frontend Framework:** React 18 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Styled-Components, MUI, Bootstrap
* **State Management:** Zustand
* **API Handling:** Axios + TanStack React Query
* **UI Libraries:** Ant Design, MUI, FontAwesome, React Icons
* **Text Editor:** React Quill, DraftJS
* **Animation:** Framer Motion
* **Real-time Communication:** Socket.IO
* **Utilities:** ESLint, PostCSS, Skeleton Loader, Toastify

## 📦 Installed Packages

> For the full list of packages and versions, refer to [`package.json`](./package.json)

### UI & Styling

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/material @mui/styled-engine-sc styled-components
npm install antd bootstrap tailwindcss font-awesome react-icons
```

### State & API

```bash
npm install zustand @tanstack/react-query axios @tanstack/react-query-devtools
```

### Utilities

```bash
npm install react-router-dom react-loading-skeleton react-toastify framer-motion socket.io-client
```

### Rich Text Editor

```bash
npm install react-quill draft-js
```

### Development

```bash
npm install -D vite eslint typescript @vitejs/plugin-react-swc postcss autoprefixer postcss-nesting
```

## 🛠️ Setup & Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Build

```bash
npm run preview
```

### 5. Lint the Project

```bash
npm run lint
```

## 🧪 ESLint Configuration

This project uses a strict and type-aware ESLint setup with React rules and stylistic support.

To enable type-aware linting:

```js
// eslint.config.js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    react: { version: '18.3' },
  },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

## 📄 Documentation & Resources

* **📚 API Documentation**

  * [API Doc 1](https://docs.google.com/document/d/1hIGZgL8ud8hDSC00pZqT5zkhUP9D2dSzK0Q6ejeN4lo/edit)
  * [API Schema (Spreadsheet)](https://docs.google.com/spreadsheets/d/1UOjSial58mQEcCUgzPTpOiOrMUoFYCV4-sP69BjWpTM/edit?gid=0#gid=0)
  * [User Flow & Notes](https://docs.google.com/document/d/1MviKbWSPneuW-D7vGgan5lqtSiUrMDXgf6Q-G4CPaDg/edit)

* **🎨 Figma UI Design**

  * [Education Forum Design](https://www.figma.com/design/JjojkUhaEudClRawLs94oS/Education?node-id=0-1&p=f&t=jidVGTFoMmyy0BBR-0)

* **📘 Library List**

  * [Library Sheet](https://docs.google.com/spreadsheets/d/1rnxHeDqpRxoIWLvTzT1x4gP69FN40is0hbAjuaW0bB0/edit?gid=0#gid=0)

## ✨ Features Overview

* 🔐 Authentication (Register / Login / Logout / Refresh)
* 👤 Profile management
* 📚 Forum post & user post system
* 🔄 Real-time updates via Socket.IO
* 🧠 Responsive & accessible design using modern UI libraries
* ⚡ Fast development experience with Vite + HMR
* 🔍 SEO & performance-ready configurations

## 📌 Notes

This project is actively being developed and structured for scalability and maintainability. Feel free to fork, contribute, or open issues for discussion.

---

### 💡 Want to contribute?

Pull requests are welcome! Please follow the coding style and make sure your code is linted before submission.

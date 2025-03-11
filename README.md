# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Download Package
- Router
```js
npm install react-router-dom
```
- Bootstrap
```js
npm install bootstrap
```
- MUI UI
```js
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/material @mui/styled-engine-sc styled-components
```
- FontAwesome
```js
npm i font-awesome
npm install react-icons 
```
- Styled-Components
```js
npm i styled-components
```
- React-Quill ( Rich text editor)
```js
npm install react-quill
```
# Library Used 
https://docs.google.com/spreadsheets/d/1rnxHeDqpRxoIWLvTzT1x4gP69FN40is0hbAjuaW0bB0/edit?gid=0#gid=0

# API Documentations
https://docs.google.com/document/d/1hIGZgL8ud8hDSC00pZqT5zkhUP9D2dSzK0Q6ejeN4lo/edit?tab=t.0
https://docs.google.com/spreadsheets/d/1UOjSial58mQEcCUgzPTpOiOrMUoFYCV4-sP69BjWpTM/edit?gid=0#gid=0
https://docs.google.com/document/d/1MviKbWSPneuW-D7vGgan5lqtSiUrMDXgf6Q-G4CPaDg/edit?tab=t.0

# Figma Layout of our Website
https://www.figma.com/design/JjojkUhaEudClRawLs94oS/Education?node-id=0-1&p=f&t=jidVGTFoMmyy0BBR-0
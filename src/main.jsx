import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PostProvider } from './postcontext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostProvider>
      <App />
    </PostProvider>
  </React.StrictMode>
)
import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { CookiesProvider } from 'react-cookie'

document.getElementsByTagName('title')[0].innerHTML = 'KAIST Alumni Database'

createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </CookiesProvider>,
)

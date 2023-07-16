
import { createRPCClient } from 'vite-dev-rpc'
// const rpc = createRPCClient('email-preview', import.meta.hot, {
//   alert(message) {
//     msg.textContent = message
//   },
// })
// const app = document.querySelector<HTMLDivElement>('#root')!

// app.innerHTML = `
//   <h1>vite-dev-rpc</h1>

//   <button id="button">Update</button>
//   <div id="list"></div>
// `

// if (import.meta.hot) {
//   const div = document.getElementById('output')! as HTMLIFrameElement
//   const button = document.getElementById('button')!
//   const list = document.getElementById('list')!
//   button.addEventListener('click', update)

//   const rpc = createRPCClient('email-preview', import.meta.hot)


//   async function update() {
//     try {
//         const ht = await rpc.listEmails()
//         list.innerHTML = ht;

//     } catch (e) {
//         console.log('lll');
        
//         console.log(e);
        
//     }
    
//   }

//   update()
// }

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


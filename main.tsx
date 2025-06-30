import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CodingGame from './Coding Game/app/page'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CodingGame/>
  </StrictMode>,
)

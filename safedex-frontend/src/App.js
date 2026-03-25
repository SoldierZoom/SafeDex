
import './App.css'
import AppLayout from './layout/Layout'
import Content from './Content'
import { BrowserRouter } from 'react-router-dom'
import { AccessibilityProvider } from './context/AccessibilityContext'

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AppLayout>
          <Content />
        </AppLayout>
      </AccessibilityProvider>
    </BrowserRouter>
  )

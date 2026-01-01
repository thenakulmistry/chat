import './App.css'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StyleEditor from './pages/StyleEditor'
import Subaccounts from './pages/Subaccounts'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/styles" element={
          <PrivateRoute>
            <StyleEditor />
          </PrivateRoute>
        } />

        <Route path="/subaccounts" element={
          <PrivateRoute>
            <Subaccounts />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

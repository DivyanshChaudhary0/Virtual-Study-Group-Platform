
import './App.css'
import AppRoutes from './Routes/AppRoutes'
import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
    <>
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
    </>
  )
}

export default App

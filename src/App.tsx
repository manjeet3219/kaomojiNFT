import  Home  from "./components/Home.tsx"
import Install from "./components/Install.tsx"
import './App.css'

function App() {
    return window.ethereum? <Home /> : <Install />
}

export default App

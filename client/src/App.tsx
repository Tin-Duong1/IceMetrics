import './App.css'
import Home from './components/home/Home'
import Navbar from './components/navbar/Navbar'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <main>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App

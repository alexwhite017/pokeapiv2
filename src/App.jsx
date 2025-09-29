import './App.css'
import NavBar from './components/NavBar'
import Results from './components/Results.jsx';


function App() {

  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        
        <Results name="Home" />
        
      </main>
    </>
  )
}

export default App

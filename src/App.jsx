import "./App.css";
import NavBar from "./components/NavBar";
import Results from "./components/Results.jsx";
import PokemonDetails from "./components/PokemonDetails";

function App(props) {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        {(props.page === "Details" && <PokemonDetails />) || (
          <Results name={props.page} />
        )}
      </main>
    </>
  );
}

export default App;

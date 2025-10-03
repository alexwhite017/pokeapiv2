import NavBar from "./components/NavBar";
import Results from "./components/Results";
import SearchBar from "./components/SearchBar";

function Search() {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Results name="Search" />
      </main>
    </>
  );
}

export default Search;

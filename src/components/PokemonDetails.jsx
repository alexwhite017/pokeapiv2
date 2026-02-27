import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import SearchBar from "./SearchBar";
import StatGraph from "./PokemonDetailsComponents/StatGraph";
import BasicData from "./PokemonDetailsComponents/BasicData";
import DexEntries from "./PokemonDetailsComponents/DexEntries";
import LearnSet from "./PokemonDetailsComponents/LearnSet";
import { pokemonTypes } from "../data/pokemonTypes";

const PokemonNav = ({ currentId, allPokemonData, onNavigate }) => {
  const prevId = currentId - 1;
  const nextId = currentId + 1;
  const hasPrev = prevId >= 1;
  const hasNext = nextId <= 1025;

  const getName = (id) => {
    const entry = allPokemonData.find(
      (p) => Number(p.url.split("/")[6]) === id
    );
    return entry ? entry.name : "";
  };

  const getTypeColor = (id) => {
    const data = pokemonTypes[id];
    return data ? `var(--color-${data.primary})` : "var(--color-surface-raised)";
  };

  const prevName = hasPrev ? getName(prevId) : "";
  const nextName = hasNext ? getName(nextId) : "";

  return (
    <div className="w-full flex justify-between items-center px-4 py-3 text-sm">
      {/* Prev */}
      <button
        onClick={() => hasPrev && onNavigate(prevName)}
        className={`flex items-center gap-2 transition-opacity ${
          hasPrev ? "hover:opacity-80" : "opacity-40 pointer-events-none"
        }`}
        aria-label={hasPrev ? `Previous: ${prevName}` : "No previous Pokémon"}
      >
        <span className="text-lg leading-none">←</span>
        <span className="flex flex-col items-start">
          <span className="text-text-muted text-xs uppercase tracking-wide">
            Prev
          </span>
          <span
            className="font-semibold capitalize"
            style={{ color: hasPrev ? getTypeColor(prevId) : "inherit" }}
          >
            {hasPrev ? `#${String(prevId).padStart(3, "0")} ${prevName}` : "—"}
          </span>
        </span>
      </button>

      {/* Next */}
      <button
        onClick={() => hasNext && onNavigate(nextName)}
        className={`flex items-center gap-2 transition-opacity ${
          hasNext ? "hover:opacity-80" : "opacity-40 pointer-events-none"
        }`}
        aria-label={hasNext ? `Next: ${nextName}` : "No next Pokémon"}
      >
        <span className="flex flex-col items-end">
          <span className="text-text-muted text-xs uppercase tracking-wide">
            Next
          </span>
          <span
            className="font-semibold capitalize"
            style={{ color: hasNext ? getTypeColor(nextId) : "inherit" }}
          >
            {hasNext ? `#${String(nextId).padStart(3, "0")} ${nextName}` : "—"}
          </span>
        </span>
        <span className="text-lg leading-none">→</span>
      </button>
    </div>
  );
};

const PokemonDetails = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [primaryType, setPrimaryType] = useState(null);

  const { pokemon } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemon("pokemon", "").then((data) => {
      setAllPokemonData(data.results);
    });

    fetchPokemon("pokemon", pokemon).then((data) => {
      setPokemonData([data[0]]);
      setPokemonSpeciesData([data[1]]);
      const type = data[0].types[0].type.name;
      setPrimaryType(type);
    });
  }, [pokemon]);

  // Signal the active type to NavBar via CSS custom property on :root
  useEffect(() => {
    if (primaryType) {
      document.documentElement.style.setProperty(
        "--active-type-color",
        `var(--color-${primaryType})`
      );
    } else {
      document.documentElement.style.removeProperty("--active-type-color");
    }
    return () => {
      document.documentElement.style.removeProperty("--active-type-color");
    };
  }, [primaryType]);

  const handleNavigate = (name) => {
    window.scrollTo(0, 0);
    navigate(`/details/${name}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 bg-surface-base">
      <SearchBar
        pokemon={pokemon}
        page="details"
        allPokemonData={allPokemonData}
      />
      {pokemonData &&
        pokemonSpeciesData &&
        pokemonData.map((poke) =>
          pokemonSpeciesData.map((species) => (
            <div key={poke.id} className="w-full flex flex-col">
              {/* Top nav */}
              <PokemonNav
                currentId={poke.id}
                allPokemonData={allPokemonData}
                onNavigate={handleNavigate}
              />
              {/* Main card */}
              <div
                className="w-full px-2 sm:px-4 h-auto flex flex-col p-4 items-start shadow-2xl rounded-2xl md:grid md:grid-cols-3 md:gap-4"
                style={{
                  background: primaryType
                    ? `linear-gradient(160deg, color-mix(in srgb, var(--color-${primaryType}) 20%, var(--color-surface-raised)), var(--color-surface-raised))`
                    : "var(--color-surface-raised)",
                }}
              >
                <BasicData poke={poke} species={species} />
                <div className="w-full md:col-span-2">
                  <DexEntries species={species} poke={poke} />
                  <LearnSet poke={poke} type={"level"} />
                  <LearnSet poke={poke} type={"machine"} />
                  <StatGraph poke={poke} />
                  <div className="evolutions">
                    <h2 className="font-bold text-xl text-center text-text-primary mb-2">
                      Evolutions
                    </h2>
                    <div className="bg-surface-raised w-full h-auto p-2 rounded-2xl flex justify-center items-center">
                      <p className="text-text-primary font-bold">
                        Evolution data not implemented yet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom nav */}
              <PokemonNav
                currentId={poke.id}
                allPokemonData={allPokemonData}
                onNavigate={handleNavigate}
              />
            </div>
          ))
        )}
    </div>
  );
};

export default PokemonDetails;

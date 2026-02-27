import SearchBar from "./SearchBar";
import PokemonCard from "./PokemonCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import { pokemonTypes } from "../data/pokemonTypes";

const Results = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { pokemon, typing } = useParams();

  useEffect(() => {
    setLoading(true);
    if (pokemon === undefined && typing === undefined) {
      fetchPokemon("pokemon", "").then((data) => {
        setPokemonData(data.results);
        setLoading(false);
      });
    } else if (typing) {
      fetchPokemon("type", typing).then((data) => {
        let pokemonList = data.pokemon.map((p) => p.pokemon);
        setPokemonData(pokemonList);
        setLoading(false);
      });
    }
  }, [pokemon, typing]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <SearchBar
          pokemon={pokemon}
          typing={typing}
          setSearchQuery={setSearchQuery}
        />
        <div className="text-xl font-bold text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <SearchBar typing={typing} setSearchQuery={setSearchQuery} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full px-4 mt-4">
        {pokemonData &&
          pokemonData
            .filter((poke) =>
              poke.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((poke, index) => {
              const id = Number(poke.url.split("/")[6]);
              if (id > 1025) return null;
              const typeData = pokemonTypes[id] || { primary: "normal", secondary: null };
              return (
                <PokemonCard
                  key={index}
                  name={poke.name}
                  id={id}
                  primaryType={typeData.primary}
                  secondaryType={typeData.secondary}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Results;

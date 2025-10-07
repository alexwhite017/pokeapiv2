import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";

const Results = (props) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { pokemon } = useParams();
  const types = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ];

  useEffect(() => {
    setLoading(true);
    if (!pokemon) {
      fetchPokemon("pokemon", "").then((data) => {
        setPokemonData(data.results);
        setLoading(false);
      });
    } else if (types.includes(pokemon.toLowerCase())) {
      fetchPokemon("type", pokemon).then((data) => {
        let pokemonList = data.pokemon.map((p) => p.pokemon);
        setIsSorting(true);
        setPokemonData(pokemonList);
        setLoading(false);
      });
    } else {
      fetchPokemon("pokemon", pokemon).then((data) => {
        setPokemonData([data[0]]);
        setIsSorting(false);
        setLoading(false);
      });
    }
  }, [pokemon]);
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <SearchBar />
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  } else {
    if (props.name === "Search" && !isSorting) {
      return (
        <div className="flex flex-col justify-center mt-20 ">
          <SearchBar />
          <div className="flex flex-wrap justify-center items-center mx-4">
            {pokemonData &&
              pokemonData.map((poke, index) => (
                <Link
                  key={index}
                  to={`/details/${poke.name}`}
                  className="h-auto w-full "
                >
                  <div className="border p-4 m-2 rounded shadow-lg flex flex-row-reverse  items-center justify-between ">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                      alt={poke.name}
                      className="aspect-square object-contain "
                    />
                    <div className="flex flex-row-reverse justify-center items-center gap-2 ">
                      <h2 className="text-lg flex items-center  capitalize">
                        {poke.name}
                      </h2>

                      <div className="text-sm text-gray-600 hidden ">
                        Dex#: {poke.id}
                      </div>
                      <span className="flex font-bold items-center text-gray-600 ">
                        #{poke.id}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col justify-center items-center mt-20 ">
        <SearchBar />
        <div className="flex flex-wrap justify-center items-center mx-4">
          {pokemonData &&
            pokemonData.map((poke, index) =>
              poke.url.split("/")[6] > 1025 ? null : (
                <Link
                  key={index}
                  to={`/details/${poke.name}`}
                  className="h-auto w-full sm:w-1/3 sm:h-1/3 lg:h-1/4 lg:w-1/4"
                >
                  <div
                    key={index}
                    className="border p-4 m-2 gap-2 justify-between rounded shadow-lg flex flex-row-reverse sm:flex-col"
                  >
                    <div className="w-1/2 h-1/2 mb-2 m-auto hidden sm:block">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          poke.url.split("/")[6]
                        }.png`}
                        alt={poke.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        poke.url.split("/")[6]
                      }.png`}
                      alt={poke.name}
                      className="aspect-square object-contain sm:hidden"
                    />
                    <div className="flex flex-row-reverse justify-center items-center gap-2 sm:flex-col">
                      <h2 className="text-lg flex items-center sm:font-bold sm:mb-2 capitalize">
                        {poke.name}
                      </h2>

                      <div className="text-sm text-gray-600 hidden sm:block">
                        Dex#: {poke.url.split("/")[6]}
                      </div>
                      <span className="flex font-bold items-center text-gray-600 sm:hidden">
                        #{poke.url.split("/")[6]}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
        </div>
      </div>
    );
  }
};

export default Results;

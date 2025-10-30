import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";

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
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center mt-20 ">
        <SearchBar typing={typing} setSearchQuery={setSearchQuery} />
        <div className="flex flex-wrap w-full justify-center items-center mx-4">
          {pokemonData &&
            pokemonData
              .filter((poke) =>
                poke.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((poke, index) =>
                poke.url.split("/")[6] > 1025 ? null : (
                  <Link
                    key={index}
                    to={`/details/${poke.name}`}
                    className="h-auto w-full sm:min-w-75 sm:w-1/3 sm:h-1/3 lg:h-1/4 lg:w-1/4"
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

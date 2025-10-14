import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";

const Results = (props) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setIsSorting(true);
        setPokemonData(pokemonList);
        setLoading(false);
      });
    } else {
      fetchPokemon("search", pokemon).then((data) => {
        setPokemonData([data]);
        setIsSorting(false);
        setLoading(false);
      });
    }
  }, [pokemon, typing]);
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <SearchBar pokemon={pokemon} page={props.name} typing={typing} />
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  } else {
    if (props.name === "Search" && !isSorting) {
      return (
        <div className="flex flex-col justify-center mt-20 ">
          <SearchBar page={props.name} pokemon={pokemon} typing={typing} />
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
    } else if (props.name === "Sort") {
      return (
        <div className="flex flex-col justify-center items-center mt-20 ">
          <SearchBar page={props.name} pokemon={typing} typing={typing} />
          <div className="flex flex-wrap w-full justify-center items-center mx-4">
            {pokemonData &&
              pokemonData.map((poke, index) =>
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
    return (
      <div className="flex flex-col justify-center items-center mt-20 ">
        <SearchBar page={props.name} />
        <div className="flex flex-wrap w-full justify-center items-center mx-4">
          {pokemonData &&
            pokemonData.map((poke, index) =>
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

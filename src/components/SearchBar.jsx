import { useNavigate } from "react-router";
import { useState } from "react";

const SearchBar = () => {
  let navigate = useNavigate();

  const [searchPokemon, setSearchPokemon] = useState("");
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (searchPokemon.trim() === "") {
          navigate("/"); // Navigate to home if search is empty
          return;
        }
        navigate(`/search/${searchPokemon}`); // Example navigation to a detail page
      }}
      className="bg-white rounded w-auto  max-w-150 m-auto p-4 flex flex-col justify-center items-center gap-5"
    >
      <div className="bg-red-500 shadow-lg m-3 w-full h-auto flex flex-col">
        <div className="bg-red-500 w-full h-auto border-b-2 border-black shadow-2xl flex ">
          <div className="bg-blue-500 border-1 border-white rounded-full m-5 h-10 w-10"></div>

          <div className="bg-red-500 border-1 border-white rounded-full m-3 h-5 w-5"></div>
          <div className="bg-yellow-500 border-1 border-white rounded-full m-3 h-5 w-5"></div>
          <div className="bg-green-500 border-1 border-white rounded-full m-3 h-5 w-5"></div>
        </div>
        <div className="bg-white m-5 flex flex-col justify-center items-center">
          <input
            onChange={(e) => setSearchPokemon(e.target.value)}
            type="text"
            placeholder="Enter a Pokemon name or Dex#..."
            className="my-5 p-2 w-3/4 min-w-30 border border-gray-400 bg-gray-200 rounded text-black"
          />
          <div className="type-container flex flex-wrap mb-5 justify-center items-center gap-2">
            {types.map((type) => (
              <button
                type="button"
                key={type}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/search/${type}`);
                }}
                className={`bg-${type} text-white font-bold px-1 rounded text-sm min-w-15 text-center capitalize hover:scale-105 transition-transform cursor-pointer`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className=" mx-auto mb-5 p-1 w-1/3 border-white border-2 bg-green-500 text-black rounded"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

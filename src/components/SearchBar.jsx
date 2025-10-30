import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { types } from "../data/typeNames";

const SearchBar = (props) => {
  let navigate = useNavigate();
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  const [active1, setActive1] = useState(null);
  const [active2, setActive2] = useState(null);

  useEffect(() => {
    setActive1(props.typing?.split("+")[0]);
    setActive2(props.typing?.split("+")[1]);
  }, [props.typing]);

  if (props.page === "details") {
    return (
      <form
        onSubmit={(e) => {
          // Example navigation to a detail page
          e.preventDefault();
          navigate(`/`);
          // Example navigation to a detail page
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
          <div className="bg-white m-5 flex flex-col justify-center relative items-center">
            <input
              onChange={(e) =>
                setInternalSearchQuery(e.target.value.replace(/\s+/g, "-"))
              }
              type="text"
              placeholder="Enter a Pokemon name"
              value={internalSearchQuery.replace(/-/g, " ")}
              className="my-5 p-2 w-3/4 min-w-30 border border-gray-400 bg-gray-200 rounded text-black"
            />
            {internalSearchQuery && (
              <div className="searchResults z-10 absolute top-15 bg-white border border-gray-300 rounded-b shadow-lg w-3/4 overflow-auto max-h-60">
                {/* Render search results here */}
                {props.allPokemonData
                  .filter((poke) =>
                    poke.name
                      .toLowerCase()
                      .includes(internalSearchQuery.toLowerCase())
                  )
                  .map((poke, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setInternalSearchQuery("");
                        navigate(`/details/${poke.name.toLowerCase()}`);
                      }}
                      className="w-full text-left px-2 py-2 hover:bg-gray-100"
                    >
                      {poke.name.includes("-")
                        ? poke.name
                            .split("-")
                            .map(
                              (part) =>
                                part.charAt(0).toUpperCase() +
                                part.slice(1).toLowerCase()
                            )
                            .join(" ")
                        : poke.name.charAt(0).toUpperCase() +
                          poke.name.slice(1).toLowerCase()}
                    </button>
                  ))}
              </div>
            )}

            <div className="type-container flex flex-wrap mb-5 justify-center items-center gap-2">
              {types.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!active1 && !active2) {
                      navigate(`/sort/${type}`);
                    } else if (active1 === type && !active2) {
                      navigate(`/`);
                    } else if (active1 && !active2) {
                      navigate(`/sort/${active1}+${type}`);
                    } else if (active2 === type) {
                      navigate(`/sort/${active1}`);
                    } else if (active1 === type && active2) {
                      navigate(`/sort/${active2}`);
                    }
                  }}
                  className={`bg-${type} ${
                    active1 === type || active2 === type
                      ? "ring-2 ring-black"
                      : ""
                  } text-white font-bold px-1 rounded text-sm min-w-15 text-center capitalize hover:scale-105 transition-transform cursor-pointer`}
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
  }

  return (
    <form
      onSubmit={(e) => {
        // Example navigation to a detail page
        e.preventDefault();
        navigate(`/`);
        // Example navigation to a detail page
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
            onChange={(e) =>
              props.setSearchQuery(e.target.value.replace(/\s+/g, "-"))
            }
            type="text"
            placeholder="Enter a Pokemon name"
            className="my-5 p-2 w-3/4 min-w-30 border border-gray-400 bg-gray-200 rounded text-black"
          />
          <div className="type-container flex flex-wrap mb-5 justify-center items-center gap-2">
            {types.map((type) => (
              <button
                type="button"
                key={type}
                onClick={(e) => {
                  e.preventDefault();
                  if (!active1 && !active2) {
                    navigate(`/sort/${type}`);
                  } else if (active1 === type && !active2) {
                    navigate(`/`);
                  } else if (active1 && !active2) {
                    navigate(`/sort/${active1}+${type}`);
                  } else if (active2 === type) {
                    navigate(`/sort/${active1}`);
                  } else if (active1 === type && active2) {
                    navigate(`/sort/${active2}`);
                  }
                }}
                className={`bg-${type} ${
                  active1 === type || active2 === type
                    ? "ring-2 ring-black"
                    : ""
                } text-white font-bold px-1 rounded text-sm min-w-15 text-center capitalize hover:scale-105 transition-transform cursor-pointer`}
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

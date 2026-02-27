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

  const TypeFilters = () => (
    <div className="flex flex-wrap justify-center gap-1.5">
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
          className={`bg-${type} text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize transition-transform hover:scale-105 cursor-pointer ${
            active1 === type || active2 === type
              ? "ring-2 ring-white ring-offset-1 ring-offset-surface-raised"
              : "opacity-75 hover:opacity-100"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );

  if (props.page === "details") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/`);
        }}
        className="w-full max-w-xl mx-auto px-4"
      >
        <div className="bg-surface-raised border border-surface-border rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="relative">
            <input
              onChange={(e) =>
                setInternalSearchQuery(e.target.value.replace(/\s+/g, "-"))
              }
              type="text"
              placeholder="Search Pokémon..."
              value={internalSearchQuery.replace(/-/g, " ")}
              className="w-full px-4 py-2.5 bg-surface-inset border border-surface-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            {internalSearchQuery && (
              <div className="absolute top-full mt-1 z-10 w-full bg-surface-raised border border-surface-border rounded-xl shadow-2xl overflow-auto max-h-60">
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
                      className="w-full text-left px-4 py-2 text-text-primary hover:bg-surface-inset transition-colors capitalize"
                    >
                      {poke.name.replace(/-/g, " ")}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <TypeFilters />

          <button
            type="submit"
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            All Pokémon
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/`);
      }}
      className="w-full max-w-xl mx-auto px-4"
    >
      <div className="bg-surface-raised border border-surface-border rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <input
          onChange={(e) =>
            props.setSearchQuery(e.target.value.replace(/\s+/g, "-"))
          }
          type="text"
          placeholder="Search Pokémon..."
          className="w-full px-4 py-2.5 bg-surface-inset border border-surface-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />

        <TypeFilters />
      </div>
    </form>
  );
};

export default SearchBar;

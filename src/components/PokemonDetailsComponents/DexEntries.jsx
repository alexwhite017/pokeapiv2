import { useState } from "react";
import { gameColors } from "../../data/gameColors";
import { genRanges } from "../../data/genRanges";
import ContainerSkeleton from "../containerSkeleton";

const DexEntries = ({ species, poke }) => {
  const type = poke.types[0].type.name;

  const gens = [];

  const [activeTab, setActiveTab] = useState(0); // Default to Gen 1

  let activeGenEntries = getActiveGenEntries();

  for (let i = 1; i <= 9; i++) {
    gens.push(
      <h4 className="text-text-primary font-bold text-sm text-center">{i}</h4>
    );
  }

  function getActiveGenEntries() {
    if (!species || !species.flavor_text_entries) return [];

    const activeGenVersions = genRanges[activeTab];
    return species.flavor_text_entries.filter(
      (entry) =>
        entry.language.name === "en" &&
        activeGenVersions.includes(entry.version.name)
    );
  }

  return (
    <ContainerSkeleton title="Pokedex Entries" type={type}>
      <div className="tabs flex gap-1.5 overflow-x-auto pb-1 min-w-0">
        {gens.map((gen, index) => (
          <div
            className={`tab cursor-pointer gen${index + 1} flex-1 shrink-0 min-w-8 rounded-t min-h-6 transition-colors ${
              activeTab === index
                ? `bg-${type} text-white`
                : "bg-surface-inset text-text-secondary hover:bg-surface-raised"
            }`}
            key={index}
            onClick={() => setActiveTab(index)}
          >
            {gen}
          </div>
        ))}
      </div>
      <div className="bg-surface-inset py-2 rounded-b-xl">
        <div className="dex-entries flex flex-col bg-surface-raised p-2 rounded-2xl mb-5 mx-1">
          {activeGenEntries.length === 0 ? (
            <p className="text-text-primary text-center font-bold">
              No entries available for this generation.
            </p>
          ) : (
            activeGenEntries.map((entry, index) => (
              <div className="flex gap-1 mb-1" key={index}>
                <h3
                  className={`${
                    entry.version.name === "black" ||
                    entry.version.name === "black-2"
                      ? "text-white"
                      : "text-text-primary"
                  } font-bold flex justify-center items-center flex-1 min-w-20 text-center ${
                    gameColors[entry.version.name] || "bg-surface-inset"
                  } rounded-2xl capitalize text-sm md:text-base md:min-w-22`}
                >
                  {entry.version.name.replace(/-/g, " ")}
                </h3>
                <p className="text-text-primary p-1 border-1 rounded flex-6 border-surface-border">
                  {entry.flavor_text.replace(/\f/g, " ")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </ContainerSkeleton>
  );
};
export default DexEntries;

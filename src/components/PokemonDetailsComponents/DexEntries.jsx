import { useState } from "react";
import { gameColors } from "../../data/gameColors";
import { genRanges } from "../../data/genRanges";

const DexEntries = ({ species, poke }) => {
  const type = poke.types[0].type.name;

  const gens = [];

  const [activeTab, setActiveTab] = useState(0); // Default to Gen 1

  let activeGenEntries = getActiveGenEntries();

  for (let i = 1; i <= 9; i++) {
    gens.push(
      <h4 className="text-black font-bold text-sm text-center">{i}</h4>
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
    <div
      className={`entries w-full h-auto bg-${type} border-border-${type} rounded-2xl border-1 flex flex-col p-2 mb-5 md:col-span-2 md:mt-0`}
    >
      <div className={`header mt-1 mx-1 mb-3 rounded bg-${type}-secondary`}>
        <h2 className="font-bold text-xl text-center text-black">
          Pokedex Entries
        </h2>
      </div>
      <div className="tabs flex gap-2">
        {gens.map((gen, index) => (
          <div
            className={`tab ${
              activeTab === index ? "bg-white" : " hover:bg-green-400"
            } gen${index + 1} flex-1 bg-[#ACD36C] rounded-t md:min-h-6`}
            key={index}
            onClick={() => setActiveTab(index)}
          >
            {gen}
          </div>
        ))}
      </div>
      <div className="gen1 bg-[#ACD36C] py-2 rounded-b-2xl">
        <div className="dex-entries flex flex-col bg-white p-2 rounded-2xl mb-5 mx-1">
          {activeGenEntries.length === 0 ? (
            <p className="text-black text-center font-bold">
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
                      : "text-black"
                  } font-bold flex justify-center items-center flex-1 min-w-20 text-center ${
                    gameColors[entry.version.name] || "bg-gray-500"
                  } rounded-2xl capitalize text-sm md:text-base md:min-w-22`}
                >
                  {entry.version.name.replace(/-/g, " ")}
                </h3>
                <p className="text-black p-1 border-1 rounded flex-6 border-gray-500">
                  {entry.flavor_text.replace(/\f/g, " ")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default DexEntries;

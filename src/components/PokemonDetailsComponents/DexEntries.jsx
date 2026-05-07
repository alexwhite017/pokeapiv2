import { useState } from "react";
import { gameColors } from "../../data/gameColors";
import { genRanges } from "../../data/genRanges";
import ContainerSkeleton from "../containerSkeleton";

const lightVersions = new Set([
  "white", "white-2", "gold", "silver", "crystal", "yellow",
  "x", "y", "heartgold", "soulsilver", "lets-go-pikachu", "lets-go-eevee",
]);

const GEN_LABELS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

const DexEntries = ({ species, poke }) => {
  const type = poke.types[0].type.name;
  const [activeTab, setActiveTab] = useState(0);

  const activeGenEntries = (() => {
    if (!species?.flavor_text_entries) return [];
    return species.flavor_text_entries.filter(
      (entry) =>
        entry.language.name === "en" &&
        genRanges[activeTab].includes(entry.version.name)
    );
  })();

  return (
    <ContainerSkeleton title="Pokédex Entries" type={type}>
      <div className="flex gap-1 overflow-x-auto pb-1 mb-3">
        {GEN_LABELS.map((label, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`flex-1 shrink-0 min-w-8 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === index
                ? `bg-${type} text-white`
                : "bg-surface-inset text-text-secondary hover:bg-surface-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
        {activeGenEntries.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">
            No entries for this generation.
          </p>
        ) : (
          activeGenEntries.map((entry, index) => (
            <div key={index} className="bg-surface-inset rounded-xl p-3 flex gap-3">
              <span
                className={`${gameColors[entry.version.name] ?? "bg-surface-border"} ${
                  lightVersions.has(entry.version.name) ? "text-black" : "text-white"
                } text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize shrink-0 self-start leading-4`}
              >
                {entry.version.name.replace(/-/g, " ")}
              </span>
              <p className="text-text-primary text-sm leading-relaxed">
                {entry.flavor_text.replace(/\f/g, " ")}
              </p>
            </div>
          ))
        )}
      </div>
    </ContainerSkeleton>
  );
};

export default DexEntries;

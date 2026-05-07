import { useState, useEffect } from "react";
import ContainerSkeleton from "../containerSkeleton";
import { gameColors } from "../../data/gameColors";
import { genRanges } from "../../data/genRanges";

const lightVersions = new Set([
  "white", "white-2", "gold", "silver", "crystal", "yellow",
  "x", "y", "heartgold", "soulsilver", "lets-go-pikachu", "lets-go-eevee",
]);

const GEN_LABELS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

const CatchableLocations = ({ poke }) => {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const type = poke.types[0].type.name;

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke.id}/encounters`)
      .then((res) => res.json())
      .then((data) => {
        setEncounters(data);
        setLoading(false);
      });
  }, [poke.id]);

  const filteredEncounters = encounters
    .map((enc) => ({
      ...enc,
      version_details: enc.version_details.filter((vd) =>
        genRanges[activeTab].includes(vd.version.name)
      ),
    }))
    .filter((enc) => enc.version_details.length > 0);

  return (
    <ContainerSkeleton title="Catchable Locations" type={type}>
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

      <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
        {loading ? (
          <p className="text-text-muted text-sm text-center py-6">Loading...</p>
        ) : filteredEncounters.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">
            Not found in the wild in this generation.
          </p>
        ) : (
          filteredEncounters.map((enc, i) => (
            <div key={i} className="bg-surface-inset rounded-xl p-3">
              <p className="text-text-primary text-sm font-semibold capitalize mb-2">
                {enc.location_area.name.replace(/-/g, " ")}
              </p>
              <div className="flex flex-col gap-1.5">
                {enc.version_details.map((vd, j) => {
                  const minLevel = Math.min(
                    ...vd.encounter_details.map((e) => e.min_level)
                  );
                  const maxLevel = Math.max(
                    ...vd.encounter_details.map((e) => e.max_level)
                  );
                  const method =
                    vd.encounter_details[0]?.method?.name?.replace(/-/g, " ") ?? "?";
                  return (
                    <div key={j} className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`${gameColors[vd.version.name] ?? "bg-surface-border"} ${
                          lightVersions.has(vd.version.name) ? "text-black" : "text-white"
                        } text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize shrink-0`}
                      >
                        {vd.version.name.replace(/-/g, " ")}
                      </span>
                      <span className="text-text-secondary text-xs capitalize">
                        {method}
                      </span>
                      <span className="text-text-muted text-xs tabular-nums">
                        Lv.{" "}
                        {minLevel === maxLevel ? minLevel : `${minLevel}–${maxLevel}`}
                      </span>
                      <span className="text-text-muted text-xs tabular-nums">
                        {vd.max_chance}% chance
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </ContainerSkeleton>
  );
};

export default CatchableLocations;

import { useState, useEffect } from "react";
import ContainerSkeleton from "../containerSkeleton";
import { gameColors } from "../../data/gameColors";
import { genRanges } from "../../data/genRanges";

const lightVersions = new Set([
  "white", "white-2", "gold", "silver", "crystal", "yellow",
  "x", "y", "heartgold", "soulsilver", "lets-go-pikachu", "lets-go-eevee",
]);

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

  const activeVersions = genRanges[activeTab];

  const filteredEncounters = encounters
    .map((enc) => ({
      ...enc,
      version_details: enc.version_details.filter((vd) =>
        activeVersions.includes(vd.version.name)
      ),
    }))
    .filter((enc) => enc.version_details.length > 0);

  return (
    <ContainerSkeleton title="Catchable Locations" type={type}>
      <div className="tabs flex gap-1.5 overflow-x-auto pb-1 min-w-0">
        {genRanges.map((_, index) => (
          <div
            key={index}
            className={`tab cursor-pointer flex-1 shrink-0 min-w-8 rounded-t min-h-6 transition-colors ${
              activeTab === index
                ? `bg-${type} text-white`
                : "bg-surface-inset text-text-secondary hover:bg-surface-raised"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <h4 className="text-text-primary font-bold text-sm text-center">
              {index + 1}
            </h4>
          </div>
        ))}
      </div>
      <div className="bg-surface-inset py-2 rounded-b-xl">
        {loading ? (
          <p className="text-text-secondary text-sm text-center py-2">Loading...</p>
        ) : filteredEncounters.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-2">
            Not found in the wild in this generation.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto px-2">
            {filteredEncounters.map((enc, i) => (
              <div key={i} className="bg-surface-raised rounded-xl p-2">
                <p className="text-text-primary text-xs font-semibold mb-1.5 capitalize">
                  {enc.location_area.name.replace(/-/g, " ")}
                </p>
                <div className="flex flex-col gap-1">
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
                      <div key={j} className="flex items-center gap-1.5">
                        <span
                          className={`${gameColors[vd.version.name] ?? "bg-surface-border"} ${
                            lightVersions.has(vd.version.name) ? "text-black" : "text-white"
                          } text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize shrink-0`}
                        >
                          {vd.version.name.replace(/-/g, " ")}
                        </span>
                        <span className="text-text-muted text-[10px] capitalize">
                          {method} · Lv.{" "}
                          {minLevel === maxLevel ? minLevel : `${minLevel}–${maxLevel}`} ·{" "}
                          {vd.max_chance}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContainerSkeleton>
  );
};

export default CatchableLocations;

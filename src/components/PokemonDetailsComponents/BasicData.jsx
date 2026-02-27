import { useState } from "react";
import { evNames } from "../../data/evNames";
import { statColors } from "../../data/statColors";

const Stat = ({ label, value }) => (
  <div className="bg-white/10 rounded-xl px-3 py-2">
    <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
    <p className="text-white text-sm font-semibold capitalize">{value}</p>
  </div>
);

const BasicData = ({ poke, species }) => {
  const [activeTab, setActiveTab] = useState(0);
  const type = poke.types[0].type.name;

  const genderText =
    species.gender_rate === -1
      ? "Genderless"
      : `${((species.gender_rate / 8) * 100).toFixed(0)}% F`;

  return (
    <div className={`bg-${type} rounded-2xl overflow-hidden mb-5 md:col-span-1`}>
      {/* Artwork header */}
      <div className="bg-black/20 px-4 pt-4 pb-3 flex flex-col items-center gap-3">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-white font-bold text-xl capitalize">{poke.name}</h2>
          <span className="text-white/70 font-bold tabular-nums">
            #{String(poke.id).padStart(3, "0")}
          </span>
        </div>

        <div className="flex gap-2">
          {[
            { label: "Official", value: 0 },
            { label: "Shiny", value: 2 },
          ].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(value)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activeTab === value
                  ? "bg-white text-black"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <img
          src={
            activeTab === 0
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`
              : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${poke.id}.png`
          }
          alt={poke.name}
          className="w-44 h-44 object-contain drop-shadow-xl"
        />

        <div className="flex gap-2">
          {poke.types.map((typeInfo, index) => (
            <span
              key={index}
              className={`bg-${typeInfo.type.name} text-white text-xs font-semibold px-3 py-1 rounded-full capitalize`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Data section */}
      <div className="bg-black/40 p-3 flex flex-col gap-3">
        {/* Abilities */}
        <div>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Abilities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {poke.abilities.map((abilityInfo, index) => (
              <span
                key={index}
                className="bg-white/10 text-white text-xs px-3 py-1 rounded-full capitalize"
              >
                {abilityInfo.ability.name.replace(/-/g, " ")}
                {abilityInfo.is_hidden && (
                  <span className="text-white/50 ml-1">(Hidden)</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <Stat label="Height" value={`${poke.height / 10} m`} />
          <Stat label="Weight" value={`${poke.weight / 10} kg`} />
          <Stat label="EXP Yield" value={poke.base_experience ?? "—"} />
          <Stat
            label="Growth Rate"
            value={species.growth_rate.name.replace(/-/g, " ")}
          />
          <Stat label="Catch Rate" value={species.capture_rate} />
          <Stat label="Gender" value={genderText} />
          <Stat
            label="Egg Groups"
            value={species.egg_groups.map((e) => e.name).join(", ")}
          />
          <Stat label="Hatch Cycles" value={species.hatch_counter} />
        </div>

        {/* EV Yield */}
        <div>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
            EV Yield{" "}
            <span className="text-white/90 font-bold">
              ({poke.stats.reduce((t, s) => t + s.effort, 0)} total)
            </span>
          </p>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1.5">
            {poke.stats.map((statInfo, index) => (
              <div
                key={index}
                className={`${statColors[statInfo.stat.name]} rounded text-xs py-1 flex-1 text-center flex flex-col capitalize`}
              >
                <p className="font-bold text-white">{statInfo.effort}</p>
                <p className="text-white/80 text-[10px]">
                  {evNames[statInfo.stat.name]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicData;

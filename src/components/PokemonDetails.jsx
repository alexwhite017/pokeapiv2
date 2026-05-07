import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import SearchBar from "./SearchBar";
import StatGraph from "./PokemonDetailsComponents/StatGraph";
import DexEntries from "./PokemonDetailsComponents/DexEntries";
import LearnSet from "./PokemonDetailsComponents/LearnSet";
import EvolutionChain from "./PokemonDetailsComponents/EvolutionChain";
import CatchableLocations from "./PokemonDetailsComponents/CatchableLocations";
import { evNames } from "../data/evNames";
import { statColors } from "../data/statColors";

const TABS = ["Overview", "Stats", "Moves", "Locations"];

// ─── Shared primitives ────────────────────────────────

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-surface-border last:border-0 gap-4">
    <span className="text-text-muted text-sm shrink-0">{label}</span>
    <span className="text-text-primary text-sm font-semibold text-right capitalize">
      {value}
    </span>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-surface-raised rounded-2xl ring-1 ring-surface-border overflow-hidden ${className}`}
  >
    {title && (
      <div className="px-4 py-3 border-b border-surface-border">
        <h3 className="text-text-primary font-bold text-base">{title}</h3>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

// ─── Overview Tab ─────────────────────────────────────

const OverviewTab = ({ poke, species, evolutionChainData, primaryType, onNavigate, currentId }) => {
  const genderText =
    species.gender_rate === -1
      ? "Genderless"
      : `${((species.gender_rate / 8) * 100).toFixed(0)}% F · ${(
          (1 - species.gender_rate / 8) * 100
        ).toFixed(0)}% M`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Abilities */}
        <SectionCard title="Abilities">
          <div className="flex flex-wrap gap-2">
            {poke.abilities.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl ring-1 ring-surface-border"
                style={{
                  backgroundColor: a.is_hidden
                    ? "var(--color-surface-inset)"
                    : `color-mix(in srgb, var(--color-${primaryType}) 18%, var(--color-surface-inset))`,
                }}
              >
                <span className="text-text-primary text-sm font-semibold capitalize">
                  {a.ability.name.replace(/-/g, " ")}
                </span>
                {a.is_hidden && (
                  <span className="text-text-muted text-[10px] font-normal bg-surface-border px-1.5 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Profile */}
        <SectionCard title="Profile">
          <InfoRow
            label="Catch Rate"
            value={`${species.capture_rate} (${((species.capture_rate / 255) * 100).toFixed(1)}%)`}
          />
          <InfoRow label="Gender" value={genderText} />
          <InfoRow
            label="Growth Rate"
            value={species.growth_rate.name.replace(/-/g, " ")}
          />
          <InfoRow
            label="Egg Groups"
            value={species.egg_groups.map((e) => e.name).join(", ")}
          />
          <InfoRow label="Hatch Cycles" value={species.hatch_counter} />
        </SectionCard>
      </div>

      <DexEntries species={species} poke={poke} />

      {evolutionChainData && (
        <EvolutionChain
          chain={evolutionChainData}
          type={primaryType}
          currentId={currentId}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

// ─── Stats Tab ────────────────────────────────────────

const StatsTab = ({ poke }) => {
  const totalEVs = poke.stats.reduce((t, s) => t + s.effort, 0);

  return (
    <div className="flex flex-col gap-4">
      <StatGraph poke={poke} />

      {/* EV Yield */}
      <SectionCard title="EV Yield">
        <p className="text-text-muted text-xs mb-3">
          Defeating this Pokémon yields{" "}
          <span className="text-text-primary font-semibold">{totalEVs}</span>{" "}
          effort value{totalEVs !== 1 ? "s" : ""}.
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {poke.stats.map((statInfo, index) => (
            <div
              key={index}
              className={`${statColors[statInfo.stat.name]} rounded-xl py-2.5 flex flex-col items-center gap-0.5`}
            >
              <span className="text-white font-black text-lg leading-none">
                {statInfo.effort}
              </span>
              <span className="text-white/70 text-[10px] font-medium text-center leading-tight px-1">
                {evNames[statInfo.stat.name]}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ─── Moves Tab ────────────────────────────────────────

const MovesTab = ({ poke }) => (
  <div className="flex flex-col gap-4">
    <LearnSet poke={poke} type="level" />
    <LearnSet poke={poke} type="machine" />
  </div>
);

// ─── Locations Tab ────────────────────────────────────

const LocationsTab = ({ poke }) => <CatchableLocations poke={poke} />;

// ─── Hero ─────────────────────────────────────────────

const Hero = ({ poke, species, primaryType, isShiny, setIsShiny, allPokemonData, onNavigate, pokemon }) => {
  const currentId = poke.id;
  const prevId = currentId - 1;
  const nextId = currentId + 1;
  const hasPrev = prevId >= 1;
  const hasNext = nextId <= 1025;

  const getName = (id) => {
    const entry = allPokemonData.find((p) => Number(p.url.split("/")[6]) === id);
    return entry ? entry.name : "";
  };

  const speciesName =
    species?.genera?.find((g) => g.language.name === "en")?.genus ?? "";

  const artworkSrc = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${currentId}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentId}.png`;

  return (
    <div
      className="relative w-full overflow-hidden pt-16"
      style={{
        background: `linear-gradient(150deg,
          var(--color-${primaryType}) 0%,
          color-mix(in srgb, var(--color-${primaryType}) 55%, var(--color-surface-base)) 45%,
          var(--color-surface-base) 75%)`,
      }}
    >
      {/* Pokéball ring watermark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "52px solid rgba(255,255,255,0.07)",
          top: "-80px",
          right: "-80px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none select-none"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "28px solid rgba(255,255,255,0.05)",
          top: "60px",
          right: "140px",
        }}
        aria-hidden="true"
      />

      {/* Search bar */}
      <div className="relative z-10 pt-4 px-4">
        <SearchBar pokemon={pokemon} page="details" allPokemonData={allPokemonData} />
      </div>

      {/* Content: artwork + info */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-8 px-6 pt-4 pb-0 max-w-3xl mx-auto">
        {/* Artwork + desktop prev/next */}
        <div className="relative flex items-center shrink-0">
          {hasPrev && (
            <button
              onClick={() => onNavigate(getName(prevId))}
              className="hidden md:flex items-center gap-1 pr-4 text-white/50 hover:text-white transition-colors group cursor-pointer"
              aria-label={`Previous: ${getName(prevId)}`}
            >
              <span className="text-3xl leading-none">‹</span>
              <div className="flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white/50 uppercase tracking-wide">Prev</span>
                <span className="text-xs font-semibold capitalize max-w-20 truncate">
                  {getName(prevId).replace(/-/g, " ")}
                </span>
              </div>
            </button>
          )}

          <img
            src={artworkSrc}
            alt={poke.name}
            className="w-48 h-48 md:w-60 md:h-60 object-contain"
            style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
          />

          {hasNext && (
            <button
              onClick={() => onNavigate(getName(nextId))}
              className="hidden md:flex items-center gap-1 pl-4 text-white/50 hover:text-white transition-colors group cursor-pointer"
              aria-label={`Next: ${getName(nextId)}`}
            >
              <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white/50 uppercase tracking-wide">Next</span>
                <span className="text-xs font-semibold capitalize max-w-20 truncate">
                  {getName(nextId).replace(/-/g, " ")}
                </span>
              </div>
              <span className="text-3xl leading-none">›</span>
            </button>
          )}
        </div>

        {/* Info block */}
        <div className="flex flex-col items-center md:items-start gap-3 pb-8 text-center md:text-left">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] tabular-nums">
              #{String(currentId).padStart(3, "0")}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white capitalize leading-none tracking-tight mt-0.5">
              {poke.name.replace(/-/g, " ")}
            </h1>
            {speciesName && (
              <p className="text-white/50 text-sm mt-1 italic">{speciesName}</p>
            )}
          </div>

          {/* Types */}
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            {poke.types.map((t) => (
              <span
                key={t.type.name}
                className={`bg-${t.type.name} text-white text-sm font-bold px-4 py-1 rounded-full capitalize`}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          {/* Official / Shiny toggle */}
          <div className="flex gap-1 bg-black/25 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setIsShiny(false)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isShiny ? "bg-white text-black shadow" : "text-white/60 hover:text-white"
              }`}
            >
              Official
            </button>
            <button
              type="button"
              onClick={() => setIsShiny(true)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                isShiny ? "bg-white text-black shadow" : "text-white/60 hover:text-white"
              }`}
            >
              ✦ Shiny
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                Height
              </p>
              <p className="text-white font-bold text-sm">{poke.height / 10} m</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                Weight
              </p>
              <p className="text-white font-bold text-sm">{poke.weight / 10} kg</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                Base EXP
              </p>
              <p className="text-white font-bold text-sm">
                {poke.base_experience ?? "—"}
              </p>
            </div>
          </div>

          {/* Mobile prev/next */}
          <div className="flex gap-2 md:hidden">
            <button
              onClick={() => hasPrev && onNavigate(getName(prevId))}
              disabled={!hasPrev}
              className={`text-xs font-semibold px-3 py-2 rounded-xl bg-black/20 text-white transition-all cursor-pointer ${
                hasPrev ? "hover:bg-black/35" : "opacity-30 cursor-not-allowed"
              }`}
            >
              ‹ {hasPrev ? getName(prevId).replace(/-/g, " ") : "—"}
            </button>
            <button
              onClick={() => hasNext && onNavigate(getName(nextId))}
              disabled={!hasNext}
              className={`text-xs font-semibold px-3 py-2 rounded-xl bg-black/20 text-white transition-all cursor-pointer ${
                hasNext ? "hover:bg-black/35" : "opacity-30 cursor-not-allowed"
              }`}
            >
              {hasNext ? getName(nextId).replace(/-/g, " ") : "—"} ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────

const PokemonDetails = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);
  const [evolutionChainData, setEvolutionChainData] = useState(null);
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [primaryType, setPrimaryType] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const { pokemon } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setPokemonData(null);
    setPokemonSpeciesData(null);
    setIsShiny(false);
    setActiveTab("Overview");

    fetchPokemon("pokemon", "").then((data) => {
      setAllPokemonData(data.results);
    });

    fetchPokemon("pokemon", pokemon).then((data) => {
      setPokemonData(data[0]);
      setPokemonSpeciesData(data[1]);
      setEvolutionChainData(data[2] || null);
      setPrimaryType(data[0].types[0].type.name);
    });
  }, [pokemon]);

  useEffect(() => {
    if (primaryType) {
      document.documentElement.style.setProperty(
        "--active-type-color",
        `var(--color-${primaryType})`
      );
    } else {
      document.documentElement.style.removeProperty("--active-type-color");
    }
    return () => {
      document.documentElement.style.removeProperty("--active-type-color");
    };
  }, [primaryType]);

  const handleNavigate = (name) => {
    window.scrollTo(0, 0);
    navigate(`/details/${name}`);
  };

  if (!pokemonData || !pokemonSpeciesData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface-base">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-surface-base">
      <Hero
        poke={pokemonData}
        species={pokemonSpeciesData}
        primaryType={primaryType}
        isShiny={isShiny}
        setIsShiny={setIsShiny}
        allPokemonData={allPokemonData}
        onNavigate={handleNavigate}
        pokemon={pokemon}
      />

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-20 bg-surface-raised/90 backdrop-blur-sm border-b border-surface-border">
        <div className="max-w-3xl mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === tab
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary border-transparent"
              }`}
              style={
                activeTab === tab
                  ? { borderColor: `var(--color-${primaryType})` }
                  : {}
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === "Overview" && (
          <OverviewTab
            poke={pokemonData}
            species={pokemonSpeciesData}
            evolutionChainData={evolutionChainData}
            primaryType={primaryType}
            onNavigate={handleNavigate}
            currentId={pokemonData.id}
          />
        )}
        {activeTab === "Stats" && (
          <StatsTab poke={pokemonData} />
        )}
        {activeTab === "Moves" && <MovesTab poke={pokemonData} />}
        {activeTab === "Locations" && <LocationsTab poke={pokemonData} />}
      </div>
    </div>
  );
};

export default PokemonDetails;

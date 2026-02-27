function flattenChain(chainNode) {
  const stages = [];

  function traverse(node, depth) {
    if (!stages[depth]) stages[depth] = [];
    const id = parseInt(node.species.url.split("/").slice(-2, -1)[0]);
    stages[depth].push({
      name: node.species.name,
      id,
      details: node.evolution_details[0] || null,
    });
    node.evolves_to.forEach((child) => traverse(child, depth + 1));
  }

  traverse(chainNode, 0);
  return stages;
}

function getTriggerLabel(details) {
  if (!details) return null;
  const t = details.trigger?.name;

  if (t === "level-up") {
    if (details.min_level) return `Lv. ${details.min_level}`;
    if (details.min_happiness) return "Friendship";
    if (details.min_beauty) return "Beauty";
    if (details.time_of_day === "day") return "Level (Day)";
    if (details.time_of_day === "night") return "Level (Night)";
    if (details.known_move)
      return `Know ${details.known_move.name.replace(/-/g, " ")}`;
    if (details.location) return "Location";
    return "Level up";
  }
  if (t === "trade") {
    if (details.held_item)
      return `Trade (${details.held_item.name.replace(/-/g, " ")})`;
    return "Trade";
  }
  if (t === "use-item") {
    return details.item?.name.replace(/-/g, " ") || "Use item";
  }
  return t ? t.replace(/-/g, " ") : "";
}

const EvolutionChain = ({ chain, type, currentId, onNavigate }) => {
  const stages = flattenChain(chain.chain);

  return (
    <div className="w-full bg-surface-raised rounded-2xl overflow-hidden mb-5 ring-1 ring-surface-border">
      <div className={`bg-${type} px-4 py-2.5`}>
        <h2 className="font-bold text-lg text-white">Evolution Chain</h2>
      </div>
      <div className="p-3 overflow-x-auto">
        {stages.length <= 1 ? (
          <p className="text-center text-text-muted py-2">
            This Pokémon does not evolve.
          </p>
        ) : (
          <div className="flex flex-row items-center justify-center gap-1 min-w-max mx-auto">
            {stages.map((stage, stageIdx) => (
              <div key={stageIdx} className="flex flex-row items-center gap-1">
                {stageIdx > 0 && (
                  <span className="text-text-muted text-xl px-1 self-center">
                    →
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  {stage.map((poke) => (
                    <button
                      key={poke.name}
                      type="button"
                      onClick={() => onNavigate(poke.name)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors cursor-pointer w-24 ${
                        poke.id === currentId
                          ? "bg-surface-inset"
                          : "hover:bg-surface-inset"
                      }`}
                      style={
                        poke.id === currentId
                          ? {
                              outline: `2px solid var(--color-${type})`,
                              outlineOffset: "-2px",
                            }
                          : {}
                      }
                    >
                      {poke.details && (
                        <span className="text-text-muted text-[10px] text-center leading-tight capitalize w-full">
                          {getTriggerLabel(poke.details)}
                        </span>
                      )}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
                        alt={poke.name}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-text-primary text-xs font-semibold capitalize text-center leading-tight">
                        {poke.name.replace(/-/g, " ")}
                      </span>
                      <span className="text-text-muted text-[10px] tabular-nums">
                        #{String(poke.id).padStart(3, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionChain;

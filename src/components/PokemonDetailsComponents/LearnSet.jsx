import { useState, useEffect } from "react";
import fetchMoveList from "../../functions/fetchMoveList";
import ContainerSkeleton from "../containerSkeleton";

const GAME_OPTIONS = [
  { value: "red-blue", label: "Red / Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "gold-silver", label: "Gold / Silver" },
  { value: "crystal", label: "Crystal" },
  { value: "ruby-sapphire", label: "Ruby / Sapphire" },
  { value: "emerald", label: "Emerald" },
  { value: "firered-leafgreen", label: "FireRed / LeafGreen" },
  { value: "diamond-pearl", label: "Diamond / Pearl" },
  { value: "platinum", label: "Platinum" },
  { value: "heartgold-soulsilver", label: "HeartGold / SoulSilver" },
  { value: "black-white", label: "Black / White" },
  { value: "black-2-white-2", label: "Black 2 / White 2" },
  { value: "x-y", label: "X / Y" },
  { value: "sun-moon", label: "Sun / Moon" },
  { value: "ultra-sun-ultra-moon", label: "Ultra Sun / Ultra Moon" },
  { value: "lets-go-pikachu-lets-go-eevee", label: "Let's Go" },
  { value: "sword-shield", label: "Sword / Shield" },
  { value: "scarlet-violet", label: "Scarlet / Violet" },
];

const categoryColors = {
  physical: "bg-[#EB5529]",
  special: "bg-[#375AB2]",
  status: "bg-[#828282]",
};

const MoveRow = ({ label, moveName, type, category, power, accuracy, pp }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-surface-border last:border-0">
    <span className="text-text-muted text-xs font-mono w-12 shrink-0 text-right">
      {label}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-text-primary font-semibold capitalize text-sm leading-snug">
        {moveName}
      </p>
      <div className="flex gap-1.5 mt-1 flex-wrap">
        {type && (
          <span
            className={`bg-${type} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize`}
          >
            {type}
          </span>
        )}
        {category && (
          <span
            className={`${categoryColors[category] ?? categoryColors.status} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize`}
          >
            {category}
          </span>
        )}
      </div>
    </div>
    <div className="flex gap-3 shrink-0">
      {[
        ["Pwr", power ?? "—"],
        ["Acc", accuracy ? `${accuracy}%` : "—"],
        ["PP", pp ?? "—"],
      ].map(([stat, val]) => (
        <div key={stat} className="text-right w-8">
          <p className="text-text-muted text-[9px] uppercase tracking-wide">{stat}</p>
          <p className="text-text-primary text-xs font-semibold tabular-nums">{val}</p>
        </div>
      ))}
    </div>
  </div>
);

const LearnSet = ({ poke, type }) => {
  const [moveDetails, setMoveDetails] = useState([]);
  const [tmDetails, setTmDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iterationMoves, setIterationMoves] = useState([]);
  const [selectedGen, setSelectedGen] = useState("scarlet-violet");
  const pokeType = poke.types[0].type.name;

  useEffect(() => {
    setLoading(true);
    if (type === "machine") {
      const moves = poke.moves.filter((move) =>
        move.version_group_details.some(
          (vgd) =>
            vgd.move_learn_method.name === "machine" &&
            vgd.version_group.name === selectedGen
        )
      );
      fetchMoveList(moves, type, selectedGen).then((data) => {
        setMoveDetails(data[0]);
        setTmDetails(data[1]);
        setLoading(false);
      });
    } else {
      const moves = poke.moves
        .filter((move) =>
          move.version_group_details.some(
            (vgd) =>
              vgd.move_learn_method.name === "level-up" &&
              vgd.version_group.name === selectedGen
          )
        )
        .sort((a, b) => {
          const levelA = a.version_group_details.find(
            (vgd) =>
              vgd.move_learn_method.name === "level-up" &&
              vgd.version_group.name === selectedGen
          ).level_learned_at;
          const levelB = b.version_group_details.find(
            (vgd) =>
              vgd.move_learn_method.name === "level-up" &&
              vgd.version_group.name === selectedGen
          ).level_learned_at;
          return levelA - levelB;
        });
      setIterationMoves(moves);
      fetchMoveList(moves).then((data) => {
        setMoveDetails(data);
        setLoading(false);
      });
    }
  // poke.moves is stable per pokemon navigation — intentionally excluded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGen, type]);

  const title = type === "machine" ? "Technical Machines" : "Level-Up Moves";
  const isEmpty = type === "machine" ? !tmDetails.length : !moveDetails.length;

  return (
    <ContainerSkeleton title={title} type={pokeType}>
      <div className="flex justify-end mb-3">
        <div className="relative">
          <select
            className="appearance-none bg-surface-inset border border-surface-border text-text-primary text-sm rounded-xl pl-3 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-surface-border cursor-pointer"
            value={selectedGen}
            onChange={(e) => {
              setSelectedGen(e.target.value);
              setLoading(true);
            }}
          >
            {GAME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-xs">
            ▾
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto rounded-xl bg-surface-inset px-3">
        {loading ? (
          <div className="py-8 text-center text-text-muted text-sm">Loading...</div>
        ) : isEmpty ? (
          <div className="py-8 text-center text-text-muted text-sm">
            No moves available for this game.
          </div>
        ) : type === "machine" ? (
          tmDetails.map((moveEntry, index) => {
            const currentMove = moveDetails.find(
              (m) => m.name === moveEntry.move.name
            );
            if (!currentMove) return null;
            return (
              <MoveRow
                key={index}
                label={moveEntry.item.name?.toUpperCase() ?? "???"}
                moveName={currentMove.name.replace(/-/g, " ")}
                type={currentMove.type?.name}
                category={currentMove.damage_class?.name ?? "status"}
                power={currentMove.power}
                accuracy={currentMove.accuracy}
                pp={currentMove.pp}
              />
            );
          })
        ) : (
          iterationMoves.map((moveEntry, index) => {
            const currentMove = moveDetails.find(
              (m) => m.name === moveEntry.move.name
            );
            if (!currentMove) return null;
            const level = moveEntry.version_group_details.find(
              (vgd) =>
                vgd.move_learn_method.name === "level-up" &&
                vgd.version_group.name === selectedGen
            )?.level_learned_at;
            return (
              <MoveRow
                key={index}
                label={`Lv.${level ?? "?"}`}
                moveName={currentMove.name.replace(/-/g, " ")}
                type={currentMove.type?.name}
                category={currentMove.damage_class?.name ?? "status"}
                power={currentMove.power}
                accuracy={currentMove.accuracy}
                pp={currentMove.pp}
              />
            );
          })
        )}
      </div>
    </ContainerSkeleton>
  );
};

export default LearnSet;

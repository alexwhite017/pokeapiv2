import { useState, useEffect } from "react";
import fetchMoveList from "../../functions/fetchMoveList";
import ContainerSkeleton from "../containerSkeleton";

const LearnSet = ({ poke, type }) => {
  const [moveDetails, setMoveDetails] = useState([]);
  const [tmDetails, setTmDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iterationMoves, setIterationMoves] = useState([]);
  const [selectedGen, setSelectedGen] = useState("red-blue");
  const pokeType = poke.types[0].type.name;

  let gens = [];

  for (let i = 1; i <= 9; i++) {
    gens.push(
      <h4 className="text-text-primary font-bold text-sm text-center">{i}</h4>
    );
  }

  let moves = [];

  useEffect(() => {
    if (type === "machine") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      moves = poke.moves.filter((move) =>
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
      moves = poke.moves
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
  }, [selectedGen]);

  if (type === "machine") {
    return (
      <ContainerSkeleton title="Technical Machines" type={pokeType}>
        <select
          id="gen-select"
          className="mb-3 p-1 text-center rounded text-text-primary w-1/2 mx-auto bg-surface-raised"
          onChange={(e) => {
            e.preventDefault();
            setSelectedGen(e.target.value);
            setLoading(true);
          }}
        >
          <option value="red-blue">Red/Blue</option>
          <option value="gold-silver">Gold/Silver</option>
          <option value="crystal">Crystal</option>
          <option value="ruby-sapphire">Ruby/Sapphire</option>
          <option value="emerald">Emerald</option>
          <option value="firered-leafgreen">FireRed/LeafGreen</option>
          <option value="diamond-pearl">Diamond/Pearl</option>
          <option value="platinum">Platinum</option>
          <option value="heartgold-soulsilver">HeartGold/SoulSilver</option>
          <option value="black-white">Black/White</option>
          <option value="black-2-white-2">Black 2/White 2</option>
          <option value="x-y">X/Y</option>
          <option value="sun-moon">Sun/Moon</option>
          <option value="ultra-sun-ultra-moon">Ultra Sun/Ultra Moon</option>
          <option value="sword-shield">Sword/Shield</option>
          <option value="scarlet-violet">Scarlet/Violet</option>
          <option value="lets-go-pikachu-lets-go-eevee">
            Let's Go Pikachu/Let's Go Eevee
          </option>
        </select>

        <div className="mx-1 mb-1 max-h-100 overflow-y-auto overflow-x-auto">
          <table className="w-full bg-surface-raised mb-2">
            <thead className="bg-[#80B9EF] sticky top-0">
              <tr className="text-text-primary font-bold text-center">
                <th className="px-3 border border-surface-border">#</th>
                <th className="px-3 border border-surface-border">Move</th>
                <th className="px-3 border border-surface-border">Type</th>
                <th className="px-3 border border-surface-border">Cat.</th>
                <th className="px-3 border border-surface-border">Pwr.</th>
                <th className="px-3 border border-surface-border">Acc.</th>
                <th className="px-3 border border-surface-border">PP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-text-primary">
                    Loading...
                  </td>
                </tr>
              ) : !tmDetails.length ? (
                <tr>
                  <td colSpan="7" className="text-center text-text-primary font-bold">
                    No moves available for this game.
                  </td>
                </tr>
              ) : (
                tmDetails.map((moveEntry, index) => {
                  let currentMove = moveDetails.find(
                    (move) => move.name === moveEntry.move.name
                  );
                  return (
                    <tr
                      key={index}
                      className="text-center text-text-primary even:bg-surface-inset odd:bg-surface-raised"
                    >
                      <td className="p-1 border border-surface-border uppercase">
                        {moveEntry.item.name ? moveEntry.item.name : "???"}
                      </td>
                      <td className="p-1 border border-surface-border capitalize">
                        {currentMove.name.replace(/-/g, " ")}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {currentMove.type ? (
                          <span
                            className={`bg-${currentMove.type.name} text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            {currentMove.type.name}
                          </span>
                        ) : (
                          "???"
                        )}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {currentMove.damage_class ? (
                          <span
                            className={`${
                              currentMove.damage_class.name === "physical"
                                ? "bg-[#EB5529]"
                                : currentMove.damage_class.name === "special"
                                ? "bg-[#375AB2]"
                                : "bg-[#828282]"
                            } text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            {currentMove.damage_class.name}
                          </span>
                        ) : (
                          <span
                            className={`bg-[#828282] text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            Status
                          </span>
                        )}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {currentMove.power ? currentMove.power : "-"}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {currentMove.accuracy
                          ? currentMove.accuracy + "%"
                          : "-"}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {currentMove.pp ? currentMove.pp : "???"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </ContainerSkeleton>
    );
  } else if (type === "level") {
    return (
      <ContainerSkeleton title="Level-Up Moves" type={pokeType}>
        <select
          id="gen-select"
          className="mb-3 p-1 text-center rounded text-text-primary w-1/2 mx-auto bg-surface-raised"
          onChange={(e) => {
            e.preventDefault();
            setSelectedGen(e.target.value);
            setLoading(true);
          }}
        >
          <option value="red-blue">Red/Blue</option>
          <option value="gold-silver">Gold/Silver</option>
          <option value="crystal">Crystal</option>
          <option value="ruby-sapphire">Ruby/Sapphire</option>
          <option value="emerald">Emerald</option>
          <option value="firered-leafgreen">FireRed/LeafGreen</option>
          <option value="diamond-pearl">Diamond/Pearl</option>
          <option value="platinum">Platinum</option>
          <option value="heartgold-soulsilver">HeartGold/SoulSilver</option>
          <option value="black-white">Black/White</option>
          <option value="black-2-white-2">Black 2/White 2</option>
          <option value="x-y">X/Y</option>
          <option value="sun-moon">Sun/Moon</option>
          <option value="ultra-sun-ultra-moon">Ultra Sun/Ultra Moon</option>
          <option value="sword-shield">Sword/Shield</option>
          <option value="scarlet-violet">Scarlet/Violet</option>
          <option value="lets-go-pikachu-lets-go-eevee">
            Let's Go Pikachu/Let's Go Eevee
          </option>
        </select>

        <div className="mx-1 mb-1 max-h-100 overflow-y-auto overflow-x-auto">
          <table className=" w-full bg-surface-raised mb-2">
            <thead className="bg-[#80B9EF] sticky top-0">
              <tr className="text-text-primary font-bold text-center">
                <th className="px-3 border border-surface-border">Level</th>
                <th className="px-3 border border-surface-border">Move</th>
                <th className="px-3 border border-surface-border">Type</th>
                <th className="px-3 border border-surface-border">Cat.</th>
                <th className="px-3 border border-surface-border">Pwr.</th>
                <th className="px-3 border border-surface-border">Acc.</th>
                <th className="px-3 border border-surface-border">PP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-text-primary">
                    Loading...
                  </td>
                </tr>
              ) : !moveDetails.length ? (
                <tr>
                  <td colSpan="7" className="text-center text-text-primary font-bold">
                    No moves available for this game.
                  </td>
                </tr>
              ) : (
                iterationMoves.map((moveEntry, index) => {
                  let currentMove = moveDetails.find(
                    (move) => move.name === moveEntry.move.name
                  );
                  return (
                    <tr
                      key={index}
                      className="text-center text-text-primary even:bg-surface-inset odd:bg-surface-raised"
                    >
                      <td className="p-1 border border-surface-border">
                        {
                          moveEntry.version_group_details.find(
                            (vgd) =>
                              vgd.move_learn_method.name === "level-up" &&
                              vgd.version_group.name === selectedGen
                          ).level_learned_at
                        }
                      </td>
                      <td className="p-1 border border-surface-border capitalize">
                        {currentMove.name.replace(/-/g, " ")}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {/* Fetch and display move type */}
                        {/* Placeholder: Replace with actual type fetching logic */}
                        {currentMove.type ? (
                          <span
                            className={`bg-${currentMove.type.name} text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            {currentMove.type.name}
                          </span>
                        ) : (
                          "???"
                        )}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {/* Fetch and display move category */}
                        {/* Placeholder: Replace with actual category fetching logic */}
                        {currentMove.damage_class ? (
                          <span
                            className={`${
                              currentMove.damage_class.name === "physical"
                                ? "bg-[#EB5529]"
                                : currentMove.damage_class.name === "special"
                                ? "bg-[#375AB2]"
                                : "bg-[#828282]"
                            } text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            {currentMove.damage_class.name}
                          </span>
                        ) : (
                          <span
                            className={`bg-[#828282] text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
                          >
                            Status
                          </span>
                        )}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {/* Fetch and display move power */}
                        {/* Placeholder: Replace with actual power fetching logic */}
                        {currentMove.power ? currentMove.power : "-"}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {/* Fetch and display move accuracy */}
                        {/* Placeholder: Replace with actual accuracy fetching logic */}
                        {currentMove.accuracy
                          ? currentMove.accuracy + "%"
                          : "-"}
                      </td>
                      <td className="p-1 border border-surface-border">
                        {/* Fetch and display move PP */}
                        {/* Placeholder: Replace with actual PP fetching logic */}
                        {currentMove.pp ? currentMove.pp : "???"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </ContainerSkeleton>
    );
  }
};

export default LearnSet;

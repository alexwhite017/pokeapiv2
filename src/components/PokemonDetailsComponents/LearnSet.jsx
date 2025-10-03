import { useState, useEffect } from "react";
import fetchMoveList from "../../functions/fetchMoveList";

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
      <h4 className="text-black font-bold text-sm text-center">{i}</h4>
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
      <div
        className={`bg-${pokeType} border-border-${pokeType} border-1 flex mb-5 flex-col sm:w-full sm:max-w-full rounded`}
      >
        <div
          className={`header mt-1 mx-1 mb-3 rounded bg-${pokeType}-secondary`}
        >
          <h2 className="font-bold text-xl text-center text-black">
            Technical Machines
          </h2>
        </div>
        <select
          id="gen-select"
          className="mb-3 p-1 text-center rounded text-black w-1/2 mx-auto bg-white"
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
          <table className="w-full bg-white mb-2">
            <thead className="bg-[#80B9EF] sticky top-0">
              <tr className="text-black font-bold text-center">
                <th className="px-3 border border-gray-300">#</th>
                <th className="px-3 border border-gray-300">Move</th>
                <th className="px-3 border border-gray-300">Type</th>
                <th className="px-3 border border-gray-300">Category</th>
                <th className="px-3 border border-gray-300">Power</th>
                <th className="px-3 border border-gray-300">Accuracy</th>
                <th className="px-3 border border-gray-300">PP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-black">
                    Loading...
                  </td>
                </tr>
              ) : !tmDetails.length ? (
                <tr>
                  <td colSpan="7" className="text-center text-black font-bold">
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
                      className="text-center text-black even:bg-gray-200 odd:bg-gray-100"
                    >
                      <td className="p-1 border border-gray-300 uppercase">
                        {moveEntry.item.name ? moveEntry.item.name : "???"}
                      </td>
                      <td className="p-1 border border-gray-300 capitalize">
                        {currentMove.name.replace(/-/g, " ")}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {currentMove.type ? currentMove.type.name : "???"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {currentMove.damage_class
                          ? currentMove.damage_class.name
                          : "???"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {currentMove.power ? currentMove.power : "-"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {currentMove.accuracy ? currentMove.accuracy : "-"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {currentMove.pp ? currentMove.pp : "???"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (type === "level") {
    return (
      <div
        className={`bg-${pokeType} border-border-${pokeType} border-1 flex mb-5 flex-col box-border sm:w-full sm:max-w-full rounded`}
      >
        <div
          className={`header mt-1 mx-1 mb-3 rounded bg-${pokeType}-secondary`}
        >
          <h2 className="font-bold text-xl text-center text-black">
            Level-Up Moves
          </h2>
        </div>
        <select
          id="gen-select"
          className="mb-3 p-1 text-center rounded text-black w-1/2 mx-auto bg-white"
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
          <table className=" w-full bg-white mb-2">
            <thead className="bg-[#80B9EF] sticky top-0">
              <tr className="text-black font-bold text-center">
                <th className="px-3 border border-gray-300">Level</th>
                <th className="px-3 border border-gray-300">Move</th>
                <th className="px-3 border border-gray-300">Type</th>
                <th className="px-3 border border-gray-300">Category</th>
                <th className="px-3 border border-gray-300">Power</th>
                <th className="px-3 border border-gray-300">Accuracy</th>
                <th className="px-3 border border-gray-300">PP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-black">
                    Loading...
                  </td>
                </tr>
              ) : !moveDetails.length ? (
                <tr>
                  <td colSpan="7" className="text-center text-black font-bold">
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
                      className="text-center text-black even:bg-gray-200 odd:bg-gray-100"
                    >
                      <td className="p-1 border border-gray-300">
                        {
                          moveEntry.version_group_details.find(
                            (vgd) =>
                              vgd.move_learn_method.name === "level-up" &&
                              vgd.version_group.name === selectedGen
                          ).level_learned_at
                        }
                      </td>
                      <td className="p-1 border border-gray-300 capitalize">
                        {currentMove.name.replace(/-/g, " ")}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {/* Fetch and display move type */}
                        {/* Placeholder: Replace with actual type fetching logic */}
                        {currentMove.type ? currentMove.type.name : "???"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {/* Fetch and display move category */}
                        {/* Placeholder: Replace with actual category fetching logic */}
                        {currentMove.damage_class
                          ? currentMove.damage_class.name
                          : "???"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {/* Fetch and display move power */}
                        {/* Placeholder: Replace with actual power fetching logic */}
                        {currentMove.power ? currentMove.power : "-"}
                      </td>
                      <td className="p-1 border border-gray-300">
                        {/* Fetch and display move accuracy */}
                        {/* Placeholder: Replace with actual accuracy fetching logic */}
                        {currentMove.accuracy ? currentMove.accuracy : "-"}
                      </td>
                      <td className="p-1 border border-gray-300">
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
      </div>
    );
  }
};

export default LearnSet;

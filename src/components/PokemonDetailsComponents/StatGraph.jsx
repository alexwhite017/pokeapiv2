const StatGraph = ({ poke }) => {
  const type = poke.types[0].type.name;
  const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    speed: "Speed",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
  };
  const statColors = {
    hp: "bg-green-500",
    attack: "bg-yellow-500",
    defense: "bg-orange-500",
    speed: "bg-purple-500",
    "special-attack": "bg-blue-300",
    "special-defense": "bg-blue-500",
  };
  const statBackground = {
    hp: "bg-green-400",
    attack: "bg-yellow-400",
    defense: "bg-orange-400",
    speed: "bg-purple-400",
    "special-attack": "bg-blue-200",
    "special-defense": "bg-blue-400",
  };

  return (
    <div
      className={`stats w-full border-border-${type} bg-${type} border-1 rounded-xl items-center overflow-hidden`}
    >
      <div className={`bg-${type}-secondary m-1 rounded-xl`}>
        <div
          className={`header border-b-1 border-${type} rounded-t-xl bg-${type}-secondary`}
        >
          <h2 className="font-bold text-xl text-center text-black">Stats</h2>
        </div>
        <div className={`bg-${type}-secondary`}>
          {poke.stats.map((stat, index) => (
            <div
              key={index}
              className={`flex h-6 border-${type} border-y-1 ${
                statBackground[stat.stat.name]
              }`}
            >
              <div
                className={`statName flex flex-1.5 sm:flex-1 w-[35%] border-${type} border-r-2 px-2 text-black`}
              >
                <div className="flex-2 justify-start font-bold text-sm">
                  {`${statNames[stat.stat.name]}`}:
                </div>
                <div className="flex-1 text-right text-sm">
                  <p>{stat.base_stat}</p>
                </div>
              </div>

              <div className="flex-3">
                <div
                  className={`${
                    statColors[stat.stat.name]
                  } my-[1px] border-1 rounded border-gray-500 ml-0.5 h-5 w-[${(
                    (stat.base_stat / 255) *
                    100
                  ).toFixed(0)}%]`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`flex h-6 border-${type} border-t-1 rounded-b-xl bg-${type}-secondary`}
        >
          <div
            className={`statName flex flex-1.5 sm:flex-1 w-[35%] border-${type} border-r-2 px-2 text-black`}
          >
            <div className="flex-2 justify-start font-bold text-sm">Total:</div>
            <div className="flex-1 text-right text-sm">
              <p>
                {poke.stats.reduce((total, stat) => total + stat.base_stat, 0)}
              </p>
            </div>
          </div>
          <div className="flex-3"></div>
        </div>
      </div>
    </div>
  );
};

export default StatGraph;

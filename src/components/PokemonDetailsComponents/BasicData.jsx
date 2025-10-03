const BasicData = ({ poke, species }) => {
  const type = poke.types[0].type.name;

  const evNames = {
    hp: "HP",
    attack: "Atk",
    defense: "Def",
    speed: "Speed",
    "special-attack": "Sp.Atk",
    "special-defense": "Sp.Def",
  };
  const statColors = {
    hp: "bg-green-500",
    attack: "bg-yellow-500",
    defense: "bg-orange-500",
    speed: "bg-purple-500",
    "special-attack": "bg-blue-300",
    "special-defense": "bg-blue-500",
  };

  return (
    <div
      className={` bg-${type} p-2 rounded-lg w-full flex flex-col gap-1 mb-5 border-border-${type} border-1 md:col-span-1`}
    >
      {/* Image Section */}
      <div
        className={`bg-${type}-secondary w-full flex gap-1 flex-col rounded `}
      >
        <div className="flex mx-2 mt-2 gap-1">
          <h2 className="bg-white rounded p-4 flex-4 text-lg text-center font-bold capitalize text-black">
            {poke.name}
          </h2>
          <h2 className="text-lg text-black bg-white text-center justify-center p-2 font-bold items-center flex rounded flex-1">
            #{poke.id}
          </h2>
        </div>
        <div className="bg-white rounded mx-2 mb-2">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
            alt={poke.name}
            className="object-contain"
          />
        </div>
      </div>
      {/* Typing Section */}
      <div
        className={`typing bg-${type}-secondary w-full flex gap-1 flex-col rounded-2xl`}
      >
        <h2 className="text-center font-bold text-lg text-black">Type</h2>
        <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
          {poke.types.map((typeInfo, index) => (
            <span
              key={index}
              className={`bg-${typeInfo.type.name} text-white font-bold px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>
      {/* Abilities Section */}
      <div
        className={`abilities bg-${type}-secondary w-full flex gap-1 flex-col rounded-2xl`}
      >
        <h2 className="text-center font-bold text-lg text-black">Abilities</h2>
        <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
          {poke.abilities.map((abilityInfo, index) => (
            <span
              key={index}
              className=" text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize"
            >
              {abilityInfo.ability.name}{" "}
              {abilityInfo.is_hidden ? " (Hidden Ability)" : ""}
            </span>
          ))}
        </div>
      </div>
      {/* Gender and Catch Rate Section */}
      <div className="flex gap-1">
        <div
          className={`gender bg-${type}-secondary w-full flex flex-1 gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">
            Gender Ratio
          </h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
              {species.gender_rate}?
            </span>
          </div>
        </div>
        <div
          className={`catch-rate bg-${type}-secondary w-full flex flex-1 gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">
            Catch Rate
          </h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
              {species.capture_rate}
            </span>
          </div>
        </div>
      </div>

      {/* Breeding Section */}
      <div className={`flex flex-col bg-${type}-secondary rounded-2xl`}>
        <h2 className="text-center font-bold text-lg text-black">Breeding</h2>
        <div className="flex">
          <div className="breeding w-full flex gap-1 flex-col  ">
            <h2 className="text-center font-bold text-lg text-black">
              Egg Groups
            </h2>
            <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-xl">
              {species.egg_groups.map((eggInfo, index) => (
                <span
                  key={index}
                  className=" text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize"
                >
                  {eggInfo.name}
                </span>
              ))}
              ,
            </div>
          </div>
          <div className="breeding w-full flex gap-1 flex-col  ">
            <h2 className="text-center font-bold text-lg text-black">
              Hatch Time
            </h2>
            <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-xl">
              <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
                {species.hatch_counter} Cycles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Height, Weight, Base Exp, and Growth Section*/}
      <div className="flex gap-1">
        <div
          className={`height bg-${type}-secondary w-full flex flex-1 gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">Height</h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
              {poke.height / 10} m
            </span>
          </div>
        </div>
        <div
          className={`weight bg-${type}-secondary w-full flex flex-1 gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">Weight</h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
              {poke.weight / 10} kg
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <div
          className={`experience bg-${type}-secondary w-full flex gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">
            EXP Yield
          </h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center">
              {poke.base_experience}
            </span>
          </div>
        </div>
        <div
          className={`growth bg-${type}-secondary w-full flex gap-1 flex-col rounded-2xl`}
        >
          <h2 className="text-center font-bold text-lg text-black">
            Growth Rate
          </h2>
          <div className="flex bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
            <span className="text-black px-1 rounded text-sm my-2 mx-1 min-w-15 text-center capitalize">
              {species.growth_rate.name.replace("-", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* EVs Section */}

      <div
        className={`evs bg-${type}-secondary w-full flex gap-1 flex-col rounded-2xl`}
      >
        <h2 className="text-center font-bold text-lg text-black">EVs</h2>
        <div className="flex flex-col bg-white justify-center items-center mx-1 mb-1 rounded-2xl">
          <h2 className="text-black">
            Total: {poke.stats.reduce((total, stat) => total + stat.effort, 0)}
          </h2>
          <div className="flex w-full gap-1 px-2">
            {poke.stats.map((statInfo, index) => (
              <div
                key={index}
                className={`${
                  statColors[statInfo.stat.name]
                } text-black rounded text-sm my-2 w-1/6 text-center flex flex-col capitalize`}
              >
                <p>{statInfo.effort}</p> <p>{evNames[statInfo.stat.name]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicData;

const StatGraph = (props) => {
    
    const poke = props.poke;
    const statNames = {hp: "HP", attack: "Attack", defense: "Defense", speed: "Speed", "special-attack": "Sp. Atk", "special-defense": "Sp. Def"};
    const statColors = {hp: "bg-green-500", attack: "bg-yellow-500", defense: "bg-orange-500", speed: "bg-purple-500", "special-attack": "bg-blue-300", "special-defense": "bg-blue-500"};
    const statBackground = {hp: "bg-green-400", attack: "bg-yellow-400", defense: "bg-orange-400", speed: "bg-purple-400", "special-attack": "bg-blue-200", "special-defense": "bg-blue-400"};

    return (
        <div className="stats w-full border-red-500  bg-red-500 border-2 rounded items-center overflow-hidden">
                        <h3 className="text-md font-bold text-center mb-2">Stats</h3>
                        <div className="">
                        {poke.stats.map((stat, index) => (
                        <div key={index} className={`flex h-6 border-red-500 border-b-2 rounded ${statBackground[stat.stat.name]}`}>
                            <div className="statName flex flex-1.5 sm:flex-1 w-[35%] border-red-500 border-r-2 px-2 text-black">
                                <div className="flex-2 justify-start font-bold text-sm">{`${statNames[stat.stat.name]}`}:</div>
                                <div className="flex-1 text-right text-sm"><p>{stat.base_stat}</p></div>
                            </div>

                            <div className="flex-3">
                                <div className={`${statColors[stat.stat.name]} my-[1px] border-1 rounded border-gray-500 ml-0.5 h-5 w-[${((stat.base_stat / 255) * 100).toFixed(0)}%]`}></div>
                            </div>
                        </div>
                        ))}
                        </div>
                        <div className={`flex h-6 border-red-500 border-b-2 rounded bg-violet-500`}>
                            <div className="statName flex flex-1.5 sm:flex-1 w-[35%] border-red-500 border-r-2 px-2 text-black">
                                <div className="flex-2 justify-start font-bold text-sm">Total:</div>
                                <div className="flex-1 text-right text-sm"><p>{poke.stats.reduce((total, stat) => total + stat.base_stat, 0)}</p></div>
                            </div>
                            <div className="flex-3">
                            </div>
                        </div>
                    </div>
    )
}

export default StatGraph;
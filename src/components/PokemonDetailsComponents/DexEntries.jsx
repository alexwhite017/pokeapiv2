import { useState } from "react";

const DexEntries = ({ species }) => {

    const gameColors = { "red": "bg-red-500", "blue": "bg-blue-500", "yellow": "bg-yellow-500", "gold": "bg-yellow-300", "silver": "bg-gray-300", "crystal": "bg-cyan-300", "ruby": "bg-red-600", "sapphire": "bg-blue-600", "emerald": "bg-green-600", "firered": "bg-red-400", "leafgreen": "bg-green-400", "diamond": "bg-blue-400", "pearl": "bg-pink-400", "platinum": "bg-[#A0A08D]", "heartgold": "bg-yellow-400", "soulsilver": "bg-[#AAB9CF]", "black": "bg-black", "white": "bg-white", 
    "black-2": "bg-black", "white-2": "bg-white", "x": "bg-blue-300", "y": "bg-pink-300", "omega-ruby": "bg-red-700", "alpha-sapphire": "bg-blue-700", "sun": "bg-yellow-400", "moon": "bg-purple-400", "ultra-sun": "bg-yellow-500", "ultra-moon": "bg-purple-500", "sword": "bg-[#00A1E9]", "shield": "bg-[#BF014F]", "brilliant-diamond": "bg-blue-500", "shining-pearl": "bg-pink-500", "legends-arceus": "bg-yellow-600", "lets-go-pikachu": "bg-[#F5DA26]", "lets-go-eevee": "bg-[#C08040]"
     };

     

    const gens = []
    const genRanges = [
            ['red', 'blue', 'yellow'], // Gen 1
            ['gold', 'silver', 'crystal'], // Gen 2
            ['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'], // Gen 3
            ['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'], // Gen 4
            ['black', 'white', 'black-2', 'white-2'], // Gen 5
            ['x', 'y', 'omega-ruby', 'alpha-sapphire'], // Gen 6
            ['sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee'], // Gen 7
            ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus'], // Gen 8
            ['scarlet', 'violet'] // Gen 9
            
        ];

    const [activeTab, setActiveTab] = useState(0); // Default to Gen 1

    let activeGenEntries = getActiveGenEntries();

     for (let i = 1; i <= 9; i++) {
        gens.push(<h4 className="text-black font-bold text-sm text-center">{i}</h4>);
     }

    function getActiveGenEntries() {
        if (!species || !species.flavor_text_entries) return [];
        
        const activeGenVersions = genRanges[activeTab];
        return species.flavor_text_entries.filter(entry => entry.language.name === 'en' && activeGenVersions.includes(entry.version.name));
    }


    return (
        <div className="entries w-full h-auto bg-red-500 border-blue-500 rounded-2xl border-1 flex flex-col mt-10 p-2 mb-2 md:col-span-2 md:mt-0">
            <h3 className="text-black font-bold text-center">Pokédex Entries</h3>
            <div className="tabs flex gap-2">
                {gens.map((gen, index) => (
                    <div className={`tab ${activeTab === index ? 'bg-white' : ' hover:bg-green-400'} gen${index + 1} flex-1 bg-[#ACD36C] rounded-t md:min-h-6`} key={index} onClick={() => setActiveTab(index)}>
                        {gen}
                    </div>
                ))}

            </div>
            <div className="gen1 bg-[#ACD36C] py-2 rounded-b-2xl">
                
                <div className="dex-entries flex flex-col bg-white p-2 rounded-2xl mb-5 mx-1">
                    {activeGenEntries.length === 0 ? <p className="text-black text-center font-bold">No entries available for this generation.</p> :
                    activeGenEntries.map((entry, index) => (
                        <div className="flex gap-1 mb-1" key={index}>
                            <h3 className={`${entry.version.name === "black" || entry.version.name === "black-2" ? 'text-white' : 'text-black'} font-bold flex justify-center items-center flex-1 min-w-20 text-center ${gameColors[entry.version.name] || 'bg-gray-500'} rounded-2xl capitalize text-sm md:text-base md:min-w-22`}>{entry.version.name.replace(/-/g, ' ')}</h3>
                            <p className="text-black p-1 border-1 rounded flex-6 border-gray-500">{entry.flavor_text.replace(/\f/g, ' ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default DexEntries;
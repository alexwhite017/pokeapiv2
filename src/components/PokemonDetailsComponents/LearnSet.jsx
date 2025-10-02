import { useState, useEffect } from "react";
import fetchMoveList from "../../functions/fetchMoveList";

const LearnSet = ({ poke, type }) => {
    const [ moveDetails, setMoveDetails ] = useState([]);
    const [ tmDetails, setTmDetails ] = useState([]);
    const [ activeTab, setActiveTab ] = useState(8);
    const [ loading, setLoading ] = useState(true);


    let genList = ['red-blue', 'gold-silver', 'ruby-sapphire', 'diamond-pearl', 'black-white', 'x-y', 'sun-moon', 'sword-shield', 'scarlet-violet'];

    let gens = [];

    for (let i = 1; i <= 9; i++) {
        gens.push(<h4 className="text-black font-bold text-sm text-center">{i}</h4>);
     }


    let moves = [];

    useEffect(() => {
        if (type === "machine") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            moves = poke.moves.filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "machine")).filter(move => move.version_group_details.some(vgd => vgd.version_group.name === genList[activeTab] && vgd.move_learn_method.name === "machine"));
            fetchMoveList(moves, type, activeTab+1).then(data => { setTmDetails(data); setLoading(false);  }); 
            fetchMoveList(moves, "data").then(data => { setMoveDetails(data);  });
            
        } else if (type === "level") {
            moves = poke.moves.filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up")).filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]))
            .sort((a, b) => {
                const levelA = a.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                const levelB = b.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                return levelA - levelB;
            });
            fetchMoveList(moves, "level", activeTab+1).then(data => { setMoveDetails(data); setLoading(false);  });

        }
            

            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); 

    
    if (type === "machine") {

        return (
            <div className="bg-red-500 flex mb-2 flex-col sm:w-full sm:max-w-full rounded">
                <div className="header mt-1 mx-1 mb-3 rounded bg-red-300">
                    <h2 className="font-bold text-xl text-center text-black">Technical Machines</h2>
                </div>
                <div className="tabs flex">
                {gens.map((gen, index) => (
                    <div className={`tab ${activeTab === index ? 'bg-white' : ' hover:bg-green-400'} gen${index + 1} flex-1 bg-[#ACD36C] mx-1 rounded-t md:min-h-6`} key={index} onClick={(e) => 
                        {
                            if (activeTab === index) return;
                            e.preventDefault();
                            setActiveTab(index);
                            setLoading(true);
                            
                        }}>
                        {gen}
                    </div>
                ))}

                </div>
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

                        {loading ? <tr><td colSpan="7" className="text-center text-black">Loading...</td></tr> : tmDetails.map((moveEntry, index) => {

                        
                            
                            let currentMove = moveDetails.find(move => move.name === moveEntry.move.name);
                                return (
                                    <tr key={index} className="text-center text-black even:bg-gray-200 odd:bg-gray-100">
                                        <td className="p-1 border border-gray-300 uppercase">{moveEntry.item.name ? moveEntry.item.name : '???'}</td>
                                        <td className="p-1 border border-gray-300 capitalize">{currentMove.name.replace(/-/g, ' ')}</td>
                                        <td className="p-1 border border-gray-300">
                                          
                                            {currentMove.type ? currentMove.type.name : '???'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                      
                                            {currentMove.damage_class ? currentMove.damage_class.name : '???'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                       
                                            {currentMove.power ? currentMove.power : '-'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                         
                                            {currentMove.accuracy ? currentMove.accuracy : '-'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                   
                                            {currentMove.pp ? currentMove.pp : '???'}
                                        </td>
                                    </tr>
                                );
                            })}
                            
                        </tbody>
                    </table>
                    
                

                </div>
            </div>
        )

    } else if (type === "level") {
     let iterationMoves = poke.moves.filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up")).filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]))
                                .sort((a, b) => {
                                const levelA = a.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                                const levelB = b.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                                return levelA - levelB;
                            });


        return (
            <div className="bg-red-500 flex mb-2 flex-col box-border sm:w-full sm:max-w-full rounded">
                <div className="header mt-1 mx-1 mb-3 rounded bg-red-300">
                    <h2 className="font-bold text-xl text-center text-black">Level-Up Moves</h2>
                </div>
                <div className="tabs flex ">
                    {gens.map((gen, index) => (
                        <div className={`tab ${activeTab === index ? 'bg-white' : ' hover:bg-green-400'} gen${index + 1} flex-1 bg-[#ACD36C] rounded-t mx-1 md:min-h-6`} key={index} onClick={(e) => {
                            if (activeTab === index) return;
                            e.preventDefault();
                            iterationMoves = poke.moves.filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up")).filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[index+1]))
                                .sort((a, b) => {
                                const levelA = a.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                                const levelB = b.version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at;
                                return levelA - levelB;
                            });
                            
                            setActiveTab(index);
                            setLoading(true);
                        }}>
                            {gen}
                        </div>
                    ))}

                </div>
                
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
                        {loading ? <tr><td colSpan="7" className="text-center text-black">Loading...</td></tr> : moveDetails.map((moveEntry, index) => {
                                return (
                                    <tr key={index} className="text-center text-black even:bg-gray-200 odd:bg-gray-100">
                                        <td className="p-1 border border-gray-300">{iterationMoves[index].version_group_details.find(vgd => vgd.move_learn_method.name === "level-up" && vgd.version_group.name === genList[activeTab]).level_learned_at}</td>
                                        <td className="p-1 border border-gray-300 capitalize">{moveEntry.name.replace(/-/g, ' ')}</td>
                                        <td className="p-1 border border-gray-300">
                                            {/* Fetch and display move type */}
                                            {/* Placeholder: Replace with actual type fetching logic */}
                                            {moveEntry.type ? moveEntry.type.name : '???'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                            {/* Fetch and display move category */}
                                            {/* Placeholder: Replace with actual category fetching logic */}
                                            {moveEntry.damage_class ? moveEntry.damage_class.name : '???'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                            {/* Fetch and display move power */}
                                            {/* Placeholder: Replace with actual power fetching logic */}
                                            {moveEntry.power ? moveEntry.power : '-'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                            {/* Fetch and display move accuracy */}
                                            {/* Placeholder: Replace with actual accuracy fetching logic */}
                                            {moveEntry.accuracy ? moveEntry.accuracy : '-'}
                                        </td>
                                        <td className="p-1 border border-gray-300">
                                            {/* Fetch and display move PP */}
                                            {/* Placeholder: Replace with actual PP fetching logic */}
                                            {moveEntry.pp ? moveEntry.pp : '???'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                

                </div>
            </div>
        )
    }




    
}

export default LearnSet;
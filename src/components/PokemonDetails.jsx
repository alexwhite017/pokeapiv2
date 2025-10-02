import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import fetchPokemonSpecies from '../functions/fetchPokemonSpecies';
import SearchBar from "./SearchBar";
import StatGraph from './PokemonDetailsComponents/StatGraph';
import BasicData from './PokemonDetailsComponents/BasicData';
import DexEntries from './PokemonDetailsComponents/DexEntries';
import LearnSet from './PokemonDetailsComponents/LearnSet';


const PokemonDetails = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);

    const { pokemon } = useParams();


    



   useEffect(() => {
        fetchPokemon(pokemon).then(data => setPokemonData([data]));
        fetchPokemonSpecies(pokemon).then(data => setPokemonSpeciesData([data]));

   }, [pokemon]);

   


    return (
        <div className="flex flex-col justify-center items-center mt-20">
                <SearchBar />
                {pokemonData && pokemonSpeciesData && (
                    pokemonData.map((poke) => (
                        pokemonSpeciesData.map((species) => (
                            <div className=" w-full mx-5 h-auto bg-gray-500 flex flex-col p-4 items-start shadow-2xl rounded-2xl md:grid md:grid-cols-3 gap-4">
                                <BasicData poke={poke} species={species} />
                                <div className="md:col-span-2">
                                    <DexEntries species={species} />
                                    <LearnSet poke={poke} type={"level"} />
                                    <LearnSet poke={poke} type={"machine"} />
                                    <StatGraph poke={poke} />
                                </div>
                                
                                
                            </div>)))
                ))}
            </div>

    )
}

export default PokemonDetails;
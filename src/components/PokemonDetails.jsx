import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import SearchBar from "./SearchBar";
import StatGraph from './PokemonDetailsComponents/StatGraph';

const PokemonDetails = () => {
        const [pokemonData, setPokemonData] = useState([]);

    const { pokemon } = useParams();

    

   useEffect(() => {
    if (!pokemon) {
        fetchPokemon("").then(data => setPokemonData(data.results));
    } else {
        fetchPokemon(pokemon).then(data => setPokemonData([data]));
       
    }
   }, [pokemon]);

   
   console.log(pokemonData);
    


    return (
        <div className="flex flex-col justify-center items-center mt-20 ">
                <SearchBar />
                {pokemonData && (
                    pokemonData.map((poke) => (
                <div className=" w-full mx-5 h-auto bg-gray-500 flex flex-col p-4 items-start shadow-2xl rounded-2xl">
                    <div className=" p-2 flex flex-col sm:flex-row w-full justify-center items-center flex-wrap">
                        <div className="img-container flex-1">
                            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} alt="pokemon" className="w-40 h-40 object-fill flex-1" />
                        </div>
                        <div className="flex flex-col justify-center text-center flex-2">
                            <h2 className="text-lg font-bold mb-2 capitalize">{poke.name}</h2>
                            <p className="text-sm text-white">Dex#: {poke.id}</p>
                        </div>
                    </div>
                    <StatGraph poke={poke} />
                    
                </div>)
                ))}
            </div>

    )
}

export default PokemonDetails;
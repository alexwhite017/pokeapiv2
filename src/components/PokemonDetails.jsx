import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import fetchPokemon from "../functions/fetchPokemon";
import fetchPokemonSpecies from '../functions/fetchPokemonSpecies';
import SearchBar from "./SearchBar";
import StatGraph from './PokemonDetailsComponents/StatGraph';
import BasicData from './PokemonDetailsComponents/BasicData';

const PokemonDetails = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);

    const { pokemon } = useParams();



    

   useEffect(() => {
    if (!pokemon) {
        fetchPokemon("").then(data => setPokemonData(data.results));
        fetchPokemonSpecies("").then(data => setPokemonSpeciesData(data.results));
    } else {
        fetchPokemon(pokemon).then(data => setPokemonData([data]));
        fetchPokemonSpecies(pokemon).then(data => setPokemonSpeciesData([data]));
    }
   }, [pokemon]);


    return (
        <div className="flex flex-col justify-center items-center mt-20 ">
                <SearchBar />
                {pokemonData && pokemonSpeciesData && (
                    pokemonData.map((poke) => (
                        pokemonSpeciesData.map((species) => (
                            <div className=" w-full mx-5 h-auto bg-gray-500 flex flex-col p-4 items-start shadow-2xl rounded-2xl">
                                <BasicData poke={poke} species={species} />
                                <StatGraph poke={poke} />
                                
                            </div>)))
                ))}
            </div>

    )
}

export default PokemonDetails;
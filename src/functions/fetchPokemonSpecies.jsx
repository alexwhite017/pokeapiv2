async function fetchPokemonSpecies(pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export default fetchPokemonSpecies;
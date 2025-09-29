async function fetchPokemon(pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}?limit=1025`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export default fetchPokemon;    
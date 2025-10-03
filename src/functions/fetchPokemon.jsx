async function fetchPokemon(pokemon) {
  let pokedata = [];
  if (pokemon === "") {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1025`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}?limit=1025`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  pokedata.push(await response.json());

  const response2 = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokedata[0].id}`
  );
  if (!response2.ok) {
    throw new Error("Network response was not ok");
  }
  pokedata.push(await response2.json());

  return pokedata;
}

export default fetchPokemon;

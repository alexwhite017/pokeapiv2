async function fetchPokemon(sort, pokemon) {
  let pokedata = [];

  //Home Page Fetch
  if (pokemon === "") {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1025`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }
  // Type Sorting Fetch
  if (sort === "type") {
    let type1 = pokemon.toLowerCase().split("+")[0];

    let type2 = pokemon.toLowerCase().split("+")[1];
    if (type1 === "") {
      type1 = type2;
      type2 = null;
    }
    const response1 = await fetch(
      `https://pokeapi.co/api/v2/type/${type1}?limit=1025`
    );
    if (!response1.ok) {
      throw new Error("Network response was not ok");
    }
    const data1 = await response1.json();
    if (type2) {
      const response2 = await fetch(
        `https://pokeapi.co/api/v2/type/${type2}?limit=1025`
      );
      if (!response2.ok) {
        throw new Error("Network response was not ok");
      }
      const data2 = await response2.json();
      // Combine or process data1 and data2 as needed
      let combined = data1.pokemon.filter((p) =>
        data2.pokemon.some((p2) => p2.pokemon.name === p.pokemon.name)
      );
      data1.pokemon = combined;
    }
    return data1;
    // Search Pokemon Fetch
  } else if (sort === "search") {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}?limit=1025`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }

  // Individual Pokemon Details Fetch
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

  const response3 = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${pokedata[1].evolution_chain.url
      .split("/")
      .slice(-2, -1)}`
  );
  if (!response3.ok) {
    throw new Error("Network response was not ok");
  }
  pokedata.push(await response3.json());

  return pokedata;
}

export default fetchPokemon;

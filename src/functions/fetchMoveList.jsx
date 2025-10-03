async function fetchMoveList(moves, list, gen) {
  let returnData = [];
  let moveList = [];
  let tmList = [];

  // You can now use moveDetails to get type, category, power, accuracy, and PP

  if (list === "machine") {
    await Promise.all(
      moves.map(async (moveEntry) => {
        const move = moveEntry.move.name;
        const response = await fetch(`https://pokeapi.co/api/v2/move/${move}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        moveList.push(await response.json());
      })
    );
    returnData.push(moveList);

    moveList = moveList.filter((tm) =>
      tm.machines.some((machine) => machine.version_group.name === gen)
    );

    await Promise.all(
      moveList.map(async (tmEntry) => {
        const machine = tmEntry.machines.find(
          (machine) => machine.version_group.name === gen
        );

        const response = await fetch(machine.machine.url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        tmList.push(await response.json());
      })
    );

    returnData.push(
      tmList.sort((a, b) => {
        const tmA = parseInt(a.item.name.slice(2));
        const tmB = parseInt(b.item.name.slice(2));
        return tmA - tmB;
      })
    );
    return returnData;
  } else {
    await Promise.all(
      moves.map(async (moveEntry) => {
        const move = moveEntry.move.name;
        const response = await fetch(`https://pokeapi.co/api/v2/move/${move}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        moveList.push(await response.json());
      })
    );

    return moveList;
  }
}

export default fetchMoveList;

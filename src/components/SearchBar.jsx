import { useNavigate } from "react-router";
import { useState } from "react";

const SearchBar = () => {
    let navigate = useNavigate();

    const [searchPokemon, setSearchPokemon] = useState("");


    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            if (searchPokemon.trim() === "") {
                navigate("/");  // Navigate to home if search is empty
                return;
            }
            navigate(`/search/${searchPokemon}`);  // Example navigation to a detail page
          }} 
             className="bg-gray-500 rounded shadow-2xl w-auto sm:w-3/4 m-4 p-4 flex flex-col justify-center items-center gap-5" >
            <input onChange={(e) => setSearchPokemon(e.target.value)}  type="text" placeholder="Search..." className="p-2 min-w-60 border border-gray-400 bg-white rounded text-black" />
             <button type="submit" className=" p-1 w-auto border-white border-2 bg-red-400 text-black rounded">Search</button>
          </form>
    )   
}

export default SearchBar;
import { Link } from "react-router";

const NavBar = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-300 text-gray-800 shadow-lg fixed top-0 left-0 right-0 h-16 z-100">
      <Link to="/">
        <h1 className="text-2xl font-bold">PokeAPI</h1>
      </Link>
    </div>
  );
};

export default NavBar;

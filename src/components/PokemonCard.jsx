import { Link } from "react-router";

const PokemonCard = ({ name, id, primaryType, secondaryType }) => {
  return (
    <Link
      to={`/details/${name}`}
      className="block h-full"
    >
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer transition-transform transition-shadow duration-150 ease-out hover:scale-[1.03] hover:shadow-2xl h-full flex flex-col"
        style={{ background: `linear-gradient(to bottom, var(--color-${primaryType}), var(--color-surface-base))` }}
      >
        {/* Dex number — absolute top-right */}
        <span className="absolute top-2 right-2 text-xs font-bold text-white/70 tabular-nums">
          #{String(id).padStart(3, '0')}
        </span>

        {/* Dex number watermark — large, bottom-right, partially clipped */}
        <span
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[4rem] font-black leading-none text-white/15 select-none pointer-events-none tabular-nums"
          aria-hidden="true"
        >
          #{String(id).padStart(3, '0')}
        </span>

        {/* Artwork area */}
        <div className="flex-1 flex items-center justify-center p-3 min-h-0">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={name}
            className="w-full h-full object-contain drop-shadow-lg max-h-36"
          />
        </div>

        {/* Info strip */}
        <div className="bg-black/40 px-3 py-2 flex flex-col items-center gap-1">
          <span className="text-white font-bold text-sm capitalize leading-tight">
            {name}
          </span>
          <div className="flex gap-1 flex-wrap justify-center">
            <span className={`bg-${primaryType} text-white text-xs font-semibold px-2 py-0.5 rounded-full capitalize`}>
              {primaryType}
            </span>
            {secondaryType && (
              <span className={`bg-${secondaryType} text-white text-xs font-semibold px-2 py-0.5 rounded-full capitalize`}>
                {secondaryType}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;

import { useState, useEffect } from "react";
import { getStatBarColor } from "../../data/statColors";
import { statNames } from "../../data/statNames";

const StatGraph = ({ poke }) => {
  const type = poke.types[0].type.name;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`stats w-full border-border-${type} bg-${type} border-1 rounded-xl items-center overflow-hidden`}
    >
      <div className={`bg-${type}-secondary m-1 rounded-xl`}>
        <div
          className={`header border-b-1 border-${type} rounded-t-xl bg-${type}-secondary`}
        >
          <h2 className="font-bold text-xl text-center text-text-primary">Stats</h2>
        </div>
        <div className={`bg-${type}-secondary`}>
          {poke.stats.map((stat, index) => (
            <div key={index} className="flex items-center py-2 px-2 gap-3">
              <div className="w-[30%] flex justify-between text-text-primary text-sm">
                <span className="font-semibold">{statNames[stat.stat.name]}</span>
                <span className="text-text-secondary">{stat.base_stat}</span>
              </div>
              <div className="flex-1 bg-black/20 rounded-full h-3">
                <div
                  className={`${getStatBarColor(stat.base_stat)} rounded-full h-3`}
                  style={{
                    width: animated
                      ? `${((stat.base_stat / 255) * 100).toFixed(0)}%`
                      : "0%",
                    transition: "width 300ms ease-out",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className={`flex h-6 border-${type} border-t-1 rounded-b-xl bg-${type}-secondary`}
        >
          <div
            className={`statName flex flex-1.5 sm:flex-1 w-[35%] border-${type} border-r-2 px-2 text-text-primary`}
          >
            <div className="flex-2 justify-start font-bold text-sm">Total:</div>
            <div className="flex-1 text-right text-sm">
              <p>
                {poke.stats.reduce((total, stat) => total + stat.base_stat, 0)}
              </p>
            </div>
          </div>
          <div className="flex-3"></div>
        </div>
      </div>
    </div>
  );
};

export default StatGraph;

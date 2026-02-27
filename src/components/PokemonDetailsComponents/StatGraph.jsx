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

  const total = poke.stats.reduce((t, s) => t + s.base_stat, 0);

  return (
    <div className="w-full bg-surface-raised rounded-2xl overflow-hidden mb-5">
      <div className={`bg-${type} px-4 py-2.5`}>
        <h2 className="font-bold text-lg text-white">Stats</h2>
      </div>
      <div className="p-3">
        {poke.stats.map((stat, index) => (
          <div key={index} className="flex items-center py-1.5 gap-3">
            <div className="w-[30%] flex justify-between text-sm">
              <span className="font-semibold text-text-primary">
                {statNames[stat.stat.name]}
              </span>
              <span className="text-text-secondary tabular-nums">
                {stat.base_stat}
              </span>
            </div>
            <div className="flex-1 bg-surface-inset rounded-full h-3">
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
        <div className="flex items-center gap-3 border-t border-surface-border mt-1 pt-2">
          <div className="w-[30%] flex justify-between text-sm">
            <span className="font-bold text-text-primary">Total</span>
            <span className="font-bold text-text-primary tabular-nums">
              {total}
            </span>
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default StatGraph;

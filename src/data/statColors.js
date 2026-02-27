// Threshold-based stat bar color
// < 30:    red    (very low)
// 30-59:   orange (below average)
// 60-89:   yellow (average)
// 90-119:  lime   (good)
// 120-149: green  (great)
// 150+:    teal   (exceptional)
export function getStatBarColor(value) {
  if (value < 30) return "bg-red-500";
  if (value < 60) return "bg-orange-500";
  if (value < 90) return "bg-yellow-400";
  if (value < 120) return "bg-lime-500";
  if (value < 150) return "bg-green-500";
  return "bg-teal-400";
}

// Backwards-compat named export for BasicData.jsx (EV display)
export const statColors = {
  hp: "bg-green-500",
  attack: "bg-yellow-500",
  defense: "bg-orange-500",
  speed: "bg-purple-500",
  "special-attack": "bg-blue-300",
  "special-defense": "bg-blue-500",
};

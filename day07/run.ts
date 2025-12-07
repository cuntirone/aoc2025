import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string) => {
  performance.mark("start");
  const manifold = input.split("\n");

  let score1 = 0;

  const beamScores: Map<number, number> = new Map;
  for (let i = 0; i < manifold.length; i++) {
    const level = manifold[i];
    if (i === 0) {
      beamScores.set(level.indexOf("S"), 1);
      continue;
    }
    
    for (const beam of beamScores.keys()) {
      if (level[beam] === "^") {
        score1++;
        if (beam > 0) {
          beamScores.set(beam-1, (beamScores.get(beam-1) || 0) + (beamScores.get(beam) || 0));
        }
        if (beam < level.length - 1) {
          beamScores.set(beam+1, (beamScores.get(beam+1) || 0) + (beamScores.get(beam) || 0));
        }
        beamScores.delete(beam);
      }
    }
  }

  console.log(`Part 1: ${score1}`);
  console.log("Part 2: " + beamScores.values().reduce((sum, val) => sum + val, 0));

  performance.mark("end");
  console.log(performance.measure("run", "start", "end").duration);
};

if (import.meta.main) {
  run(input);
}

import sample from "./sample.txt" with { type: "text" };
import sample2 from "./sample2.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string) => {
  performance.mark("start");
  const parts = input.split("\n\n");
  const freshRanges = parts[0].split("\n").map((line) => {
    const [from, to] = line.split("-").map(Number);``
    return { from, to };
  });
  const ingredients = parts[1].split("\n").map(Number);

  let score1 = 0;
  for (const ingredient of ingredients) {
    for (const range of freshRanges) {
      if (ingredient >= range.from && ingredient <= range.to) {
        score1++;
        break;
      }
    }
  }
  console.log(`Part 1: ${score1}`);

  const normalized = mergeRanges(freshRanges);

  const score2 = normalized.reduce((acc, { from, to}) => {
    return acc + to - from + 1;
  }, 0);
  console.log(`Part 2: ${score2}`);
  performance.mark("end");
  console.log(performance.measure("run", "start", "end").duration);
};

const mergeRanges = (freshRanges: { from: number; to: number; }[]) => {
  const output: { from: number; to: number; }[] = [];
  let merged = false;
  freshRanges.sort((a, b) => {
    if (a.from === b.from) {
      return a.to - b.to;
    }
    return a.from - b.from;
  })
  for (let i = 0; i < freshRanges.length; i++) {
    const current = freshRanges[i];
    const lastOutput = output[output.length -1];

    if (lastOutput && current.from >= lastOutput.from && current.from <= lastOutput.to) {
      // overlap need to merge
      const [first, _second, _third, last] = [current.from, current.to, lastOutput.from, lastOutput.to].sort();
      lastOutput.from = first;
      lastOutput.to = last;
      merged = true;
    } else {
      output.push(current);
    }
  }

  if (merged) {
    return mergeRanges(output);
  }
  return output;
}

if (import.meta.main) {
  run(input);
}



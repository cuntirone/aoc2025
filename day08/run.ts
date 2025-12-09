import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };
import { benchmark } from "../utils/benchmark.ts";

type Point = {
  x: number;
  y: number;
  z: number;
};

const run = (input: string, connections: number, take: number) => {
  const points: Point[] = input.split("\n").map((line) => {
    const [x, y, z] = line.split(",").map(Number);
    return { x, y, z };
  });
  const distances: { el1: number; el2: number; distance: number }[] =
    combinations(
      points.length,
      2,
    ).map((combo) => {
      const [el1, el2] = combo;
      return { el1, el2, distance: distance(points[el1], points[el2]) };
    }).sort((a, b) => {
      return a.distance - b.distance;
    });
  const circuits: Set<number>[] = [];

  for (let i = 0; i < distances.length; i++) {
    const { el1, el2, distance } = distances[i];
    // console.log("Looking at:", el1, el2, points[el1], points[el2], distance);
    const foundAt: number[] = [];
    for (let c = 0; c < circuits.length; c++) {
      if (circuits[c].has(el1) || circuits[c].has(el2)) {
        foundAt.push(c);
        // console.log("Found one at: ", c);
        circuits[c].add(el1);
        circuits[c].add(el2);
        // break;
      }
    }
    if (foundAt.length === 2 && foundAt[0] !== foundAt[1]) {
      // need to merge two circuits
      const [first, second] = foundAt;
      const newCircuit: Set<number> = new Set([
        ...circuits[first],
        ...circuits[second],
      ]);
      circuits.splice(second, 1);
      circuits.splice(first, 1);
      circuits.push(newCircuit);
      // console.log("Merged circuits:", first, second);
    }

    if (foundAt.length === 0) {
      circuits.push(new Set([el1, el2]));
    }

    // part 1 score is after N connections
    if (i + 1 === connections) {
      circuits.sort((a, b) => b.size - a.size);
      let score1 = 1;
      for (let i = 0; i < take; i++) {
        // console.log(circuits[i]);
        score1 *= circuits[i].size;
      }
      console.log(`Part 1: ${score1}`);
    }

    // part 2 ends when all points are connected
    if (
      i > connections - 1 && circuits.length === 1 &&
      circuits[0].size === points.length
    ) {
      console.log(
        `Part 2: ${JSON.stringify(points[el1])} to ${
          JSON.stringify(points[el2])
        } = ${points[el1].x * points[el2].x}`,
      );
      // console.log(circuits.length, circuits[0].size);
      break;
    }
    // printCircuits(circuits);
  }
};

const distance = (p1: Point, p2: Point) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2),
  );
};

const printCircuits = (circuits: Set<number>[]) => {
  for (let i = 0; i < circuits.length; i++) {
    console.log(`Circuit ${i} (${circuits[i].size}): `, [...circuits[i]]);
  }
};

const combinations = (listSize: number, groupSize: number): number[][] => {
  const output: number[][] = [];
  if (groupSize === 2) {
    for (let i = 0; i < listSize; i++) {
      for (let j = i + 1; j < listSize; j++) {
        output.push([i, j]);
      }
    }
  }
  return output;
};

if (import.meta.main) {
  benchmark(run, input, 1000, 3);
}

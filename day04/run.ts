import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const bounds = grid[0].length;
  // add extra row and columns to avoid out of bounds
  for (let row = 0; row < grid.length; row++) {
    grid[row].push(".");
  }
  grid.push(new Array(grid[0].length).fill("."));

  // score for each cell can be 1 if the score contains a roll, plus 0-8 if any of the adjecent cells has a roll
  const simpleScores: number[][] = [];
  for (let row = 0; row < bounds; row++) {
    simpleScores.push(new Array(bounds).fill(0));
    for (let col = 0; col < bounds; col++) {
      if (grid[row][col] === "@") {
        simpleScores[row][col] = 1;
      }
    }
  }
  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      if (grid[row][col] === ".") {
        continue;
      }
      /*
        only look "forward" as we go thru each cell to avoid double counting
           @ ->
        /  |  \

        mark both current cell and adjecent cell in one pass
      */
      if (grid[row][col + 1] === "@") {
        simpleScores[row][col]++;
        simpleScores[row][col + 1]++;
      }
      if (grid[row + 1][col + 1] === "@") {
        simpleScores[row][col]++;
        simpleScores[row + 1][col + 1]++;
      }
      if (grid[row + 1][col] === "@") {
        simpleScores[row][col]++;
        simpleScores[row + 1][col]++;
      }
      if (grid[row + 1][col - 1] === "@") {
        simpleScores[row][col]++;
        simpleScores[row + 1][col - 1]++;
      }
    }
  }
  let score = 0;
  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      if (simpleScores[row][col] >= 1 && simpleScores[row][col] < 5) {
        score++;
      }
    }
  }
  console.log("Part 1:", score);
  // printGrid(simpleScores);

  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      remove(simpleScores, row, col);
    }
  }

  let score2 = 0;
  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      if (simpleScores[row][col] === -1) {
        score2++;
      }
    }
  }
  console.log("Part 2:", score2);
  // printGrid(simpleScores);
};

const remove = (simpleScores: number[][], row: number, col: number) => {
  if (simpleScores[row][col] > 0 && simpleScores[row][col] <= 4) {
    simpleScores[row][col] = -1;
  } else {
    return;
  }
  if (simpleScores[row - 1] && simpleScores[row - 1][col - 1] > 1) {
    simpleScores[row - 1][col - 1]--;
    remove(simpleScores, row - 1, col - 1);
  }
  if (simpleScores[row - 1] && simpleScores[row - 1][col] > 1) {
    simpleScores[row - 1][col]--;
    remove(simpleScores, row - 1, col);
  }
  if (simpleScores[row - 1] && simpleScores[row - 1][col + 1] > 1) {
    simpleScores[row - 1][col + 1]--;
    remove(simpleScores, row - 1, col + 1);
  }
  if (simpleScores[row][col + 1] > 1) {
    simpleScores[row][col + 1]--;
    remove(simpleScores, row, col + 1);
  }
  if (simpleScores[row + 1] && simpleScores[row + 1][col + 1] > 1) {
    simpleScores[row + 1][col + 1]--;
    remove(simpleScores, row + 1, col + 1);
  }
  if (simpleScores[row + 1] && simpleScores[row + 1][col] > 1) {
    simpleScores[row + 1][col]--;
    remove(simpleScores, row + 1, col);
  }
  if (simpleScores[row + 1] && simpleScores[row + 1][col - 1] > 1) {
    simpleScores[row + 1][col - 1]--;
    remove(simpleScores, row + 1, col - 1);
  }
  if (simpleScores[row][col - 1] > 1) {
    simpleScores[row][col - 1]--;
    remove(simpleScores, row, col - 1);
  }
};

const printGrid = (simpleScores: number[][]) => {
  const bounds = simpleScores.length;
  for (let row = 0; row < bounds; row++) {
    let line = "";
    for (let col = 0; col < bounds; col++) {
      if (simpleScores[row][col] === 0) {
        line += ".";
      } else if (simpleScores[row][col] < 5) {
        line += (simpleScores[row][col] - 1).toString();
      } else {
        line += "x";
      }
    }
    console.log(line);
  }
};

if (import.meta.main) {
  console.time();
  run(input);
  console.timeEnd();
}

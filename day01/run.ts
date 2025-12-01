import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string) => {
  const data: [string, number][] = input.split("\n").map((
    line,
  ) => [line.substring(0, 1), Number.parseInt(line.substring(1))]);
  const score = data.reduce((acc, [direction, value]) => {
    let [position, score1, score2] = acc;
    if (direction === "L") {
      if (position > 0 && position < value % 100) {
        score2 += 1;
      }
      position += 100 - (value % 100);
    } else {
      if (position + value % 100 > 100) {
        score2 += 1;
      }
      position += value % 100;
    }
    score2 += Math.trunc(value / 100);
    position = position % 100;
    if (position === 0) {
      score1++;
    }
    return [position, score1, score2];
  }, [50, 0, 0]);
  console.log(`Part 1: ${score[1]} Part 2: ${score[1] + score[2]}`);
};

if (import.meta.main) {
  console.time();
  run(input);
  console.timeEnd();
}

import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const part1 = (input: string) => {
  const ranges = input.split(",").map((range) => range.split("-").map(Number));
  const invalidNumbers: number[] = [];
  ranges.forEach(([start, end]) => {
    let startLength = start.toString().length;
    const endLength = end.toString().length;
    if (startLength === endLength && endLength % 2 === 1) {
      return;
    }
    for (let i = start; i <= end; i++) {
      if (i > Math.pow(10, startLength)) {
        startLength += 1;
      }
      if (
        i % Math.pow(10, startLength / 2) ===
          Math.trunc(i / Math.pow(10, startLength / 2))
      ) {
        invalidNumbers.push(i);
        // short-circuit to next possible range of invalid numbers
        i = (Math.trunc(i / Math.pow(10, startLength / 2)) + 1) *
          Math.pow(10, startLength / 2);
      }
    }
  });
  // console.table(ranges);
  console.log(`Part 1: ${invalidNumbers.reduce((a, b) => a + b, 0)}`);
};

const part2 = (input: string) => {
  const ranges = input.split(",").map((range) => range.split("-").map(Number));
  const invalidNumbers: number[] = [];
  ranges.forEach(([start, end]) => {
    let startLength = start.toString().length;

    for (let num = start; num <= end; num++) {
      if (num > Math.pow(10, startLength)) {
        startLength += 1;
      }

      for (let j = 1; j <= Math.trunc(startLength / 2); j++) {
        if (startLength % j !== 0) {
          continue;
        }
        const digits = num.toString().slice(0, j);
        if (num.toString().replaceAll(digits, "") === "") {
          invalidNumbers.push(num);
          break;
        }
      }
    }
  });
  // console.table(invalidNumbers);
  console.log(`Part 2: ${invalidNumbers.reduce((a, b) => a + b, 0)}`);
};

const part2Fast = (input: string) => {
  const ranges = input.split(",").map((range) => range.split("-").map(Number));
  const invalidNumbers: number[] = [];
  ranges.forEach(([start, end]) => {
    let startLength = start.toString().length;

    for (let num = start; num <= end; num++) {
      if (num > Math.pow(10, startLength)) {
        startLength += 1;
      }

      for (
        let digitsAtATime = 1;
        digitsAtATime <= Math.trunc(startLength / 2);
        digitsAtATime++
      ) {
        if (startLength % digitsAtATime !== 0) {
          continue;
        }
        let control = num;
        const digits = num % Math.pow(10, digitsAtATime); // get last digits
        for (let m = 1; m < Math.trunc(startLength / digitsAtATime); m++) {
          control = Math.trunc(control / Math.pow(10, digitsAtATime)); // drop last digits
          if (control % Math.pow(10, digitsAtATime) !== digits) {
            break; // next digits are different
          }
        }
        if (control === digits) {
          invalidNumbers.push(num);
          break;
        }
      }
    }
  });
  console.log(`Part 2: ${invalidNumbers.reduce((a, b) => a + b, 0)}`);
};

if (import.meta.main) {
  console.time();
  part1(input);
  // part2(input);
  part2Fast(input); // only cut the time in third
  console.timeEnd();
}

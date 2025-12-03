import sample from "./sample.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string, howMany: number) => {
  const banks = input.split("\n").map((line) =>
    line.split("").map((num) => Number.parseInt(num))
  );
  const jolts: number[] = [];
  banks.forEach((bank) => {
    let digits = howMany;
    let jolt = 0;
    let maxIndex = 0;
    while (digits > 0) {
      const max = Math.max(
        ...bank.slice(maxIndex, digits === 1 ? bank.length : -(digits - 1)),
      );
      jolt = jolt * 10 + max;
      maxIndex = bank.indexOf(max, maxIndex) + 1;
      digits--;
    }
    jolts.push(jolt);
  });

  console.log(`For ${howMany} batteries: `, jolts.reduce((a, b) => a + b, 0));
};

if (import.meta.main) {
  console.time();
  run(input, 2);
  run(input, 12);
  console.timeEnd();
}

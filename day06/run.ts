import sample from "./sample.txt" with { type: "text" };
import sample2 from "./sample2.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };

const run = (input: string) => {
  performance.mark("start");
  const lines = input.split("\n");
  const [last, ...rest] = lines.reverse();

  const operations: any[] = [];

  last.matchAll(/[*+]\s+/g).forEach((match) => {
    operations.push({
      op: match[0].trim(),
      from: match.index,
      to: match.index + match[0].length,
    });
  });

  rest.reverse();

  operations.forEach((operation) => {
    if (operation.op === "*") {
      operation.tally = operation.tally || 1;
      operation.tally2 = operation.tally2 || 1;
    } else {
      operation.tally = operation.tally || 0;
      operation.tally2 = operation.tally2 || 0;
    }
    const part2Operands: string[] = [];
    rest.forEach((line) => {
      if (operation.op === "*") {
        operation.tally *= Number(line.substring(operation.from, operation.to));
      } else {
        operation.tally += Number(line.substring(operation.from, operation.to));
      }
      for (let i = operation.to; i > operation.from; i--) {
        const operandIndex = i - operation.from - 1;
        part2Operands[operandIndex] = (part2Operands[operandIndex] || "") + line.charAt(i-1).trim();
      }
    });
    if (operation.op === "*") {
      operation.tally2 = part2Operands.filter(val => val != "").reduce((prod, val) => prod * Number(val), 1);
    } else {
      operation.tally2 = part2Operands.filter(val => val != "").reduce((sum, val) => sum + Number(val), 0);
    }
  });

  const score1 = operations.reduce((sum, op) => sum + op.tally, 0);
  console.log("Part 1: " + score1);
  const score2 = operations.reduce((sum, op) => sum + op.tally2, 0);
  console.log("Part 2: " + score2);
  performance.mark("end");
  console.log(performance.measure("run", "start", "end").duration);
};

if (import.meta.main) {
  run(input);
}

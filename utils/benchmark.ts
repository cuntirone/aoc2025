export const benchmark = (
  work: (input: string, ...args: any[]) => void,
  input: string,
  ...args: any[]
) => {
  performance.mark("start");
  work(input, ...args);
  performance.mark("end");
  console.log(performance.measure("run", "start", "end").duration);
};

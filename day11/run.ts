import sample from "./sample.txt" with { type: "text" };
import sample2 from "./sample2.txt" with { type: "text" };
import input from "./input.txt" with { type: "text" };
import { benchmark } from "../utils/benchmark.ts";

class Device {
  self: string;
  outputs: Set<string>;

  constructor(self: string) {
    this.self = self;
    this.outputs = new Set();
  }

  connect(devices: string[]) {
    this.outputs = new Set([...this.outputs, ...devices]);
  }

  equals(other: Device): boolean {
    return this.self === other.self;
  }

  is(self: string): boolean {
    return this.self === self;
  }
}

const run = (input: string) => {
  let devices = readInput(input);
  let devicePaths: Map<string, number> = new Map();

  const part1 = countPaths("out", devices, devicePaths, "you");
  console.log("you to out:", part1);

  let score1 = countPaths("dac", devices, devicePaths, "svr");
  devicePaths.clear();
  let score2 = countPaths("fft", devices, devicePaths, "dac");
  devicePaths.clear();
  let score3 = countPaths("out", devices, devicePaths, "fft");

  devicePaths.clear();
  let score4 = countPaths("fft", devices, devicePaths, "svr");
  devicePaths.clear();
  let score5 = countPaths("dac", devices, devicePaths, "fft");
  devicePaths.clear();
  let score6 = countPaths("out", devices, devicePaths, "dac");

  console.log(
    "svr to out thru dac/fft:",
    score1 * score2 * score3 + score4 * score5 * score6,
  );
};

const countPaths = (
  toDevice: string,
  devices: Device[],
  devicePaths: Map<string, number>,
  fromDevice: string,
): number => {
  if (toDevice === fromDevice) {
    return 0;
  }
  if (devicePaths.has(toDevice)) {
    return devicePaths.get(toDevice);
  }
  // how many paths end up in toDevice
  const upstream = devices.filter((device) => device.outputs.has(toDevice));
  const upstreamCounts = upstream.map((up) => {
    if (!up.is(fromDevice)) {
      return countPaths(up.self, devices, devicePaths, fromDevice);
    } else {
      return 1;
    }
  }).reduce((a, v) => a + v, 0);
  if (devicePaths.has(toDevice)) {
    console.log("collision");
  }
  devicePaths.set(toDevice, upstreamCounts);
  return upstreamCounts;
};

const readInput = (input: string): Device[] => {
  return input.split("\n").map((line) => {
    const [dev, ...recipients] = line.split(" ");
    const device = new Device(dev.substring(0, 3));
    device.connect(recipients);
    return device;
  });
};

if (import.meta.main) {
  benchmark(run, input);
}

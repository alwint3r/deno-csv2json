import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

const flags = parse(Deno.args, {
  string: ["input", "output"],
});

if (!flags.input || !flags.output) {
  console.error("Input and output is required!");
  console.error(
    "Usage:\n\tdeno run main.ts --input <inputFile> --output <outputFile>",
  );

  Deno.exit(-1);
}

const inputContent = await Deno.readFile(flags.input);
const textDecoder = new TextDecoder("utf-8");
const textInput = textDecoder.decode(inputContent);
const lines = textInput.split("\n").map((line) => line.trim());

if (lines.length < 1) {
  Deno.exit(0);
}

const header: string = lines.shift()!;
const headerFields = header.split(",");

type ResultObject = Record<string, number | string | null | boolean>;

const result: ResultObject[] = [];

for (const line of lines) {
  const splat = line.split(",");
  const obj: ResultObject = {};
  for (let i = 0; i < headerFields.length; i++) {
    const field = headerFields[i];
    const value = splat[i];

    if (value === "true" || value === "false") {
      obj[field] = value === "true" ? true : false;
    } else if (!isNaN(parseFloat(value))) {
      obj[field] = parseFloat(value);
    } else if (!isNaN(parseInt(value))) {
      obj[field] = parseInt(value, 10);
    } else {
      obj[field] = value;
    }
  }
  result.push(obj);
}

const serialized = JSON.stringify(result);

await Deno.writeTextFile(flags.output, serialized);
import { SomeDoc, transform } from "../src/index";
import { expect, test } from "vitest";
import TypeDoc, { JSONOutput } from "typedoc";
import { writeFile, readFile } from "node:fs/promises";
import { TransformedDoc } from "../dist";

test("validate", async () => {
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: ["tests/code.ts"],
  });

  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to create project");
  }

  await app.generateJson(project, "tests/typedoc.json");
  const outputData = await readFile("tests/typedoc.json", "utf8");

  const fileData = JSON.parse(outputData) as JSONOutput.ProjectReflection;

  // generate output
  const output = transform(fileData);

  removeSources(output);

  // Write output to file for debugging
  const outputFile = JSON.stringify(output, null, 2);
  await writeFile("tests/output.json", outputFile);

  // compare output to expected output
  const expectedOutput = await readFile("tests/expectedOutput.json", "utf8");
  const expectedOutputData = JSON.parse(expectedOutput);

  removeSources(expectedOutputData);

  expect(JSON.stringify(expectedOutputData, null, 2)).toBe(
    JSON.stringify(output, null, 2),
  );
});

function removeSource(doc: SomeDoc) {
  delete doc.source;

  if (doc.kind === "class") {
    doc.methods?.forEach(removeSource);
    doc.properties?.forEach(removeSource);
  }

  return doc;
}

function removeSources(doc: TransformedDoc) {
  for (const k in doc) {
    const v = doc[k as keyof TransformedDoc];
    if (Array.isArray(v)) {
      v.forEach(removeSource);
    }
  }
}

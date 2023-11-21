/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransformedDoc, transform } from "../src/index";
import { expect, test } from "vitest";
import TypeDoc, { JSONOutput } from "typedoc";
import { writeFile, readFile } from "node:fs/promises";

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

  cleanup(output);

  // Write output to file for debugging
  const outputFile = JSON.stringify(output, null, 2);
  await writeFile("tests/output.json", outputFile);

  // compare output to expected output
  const expectedOutput = await readFile("tests/expectedOutput.json", "utf8");
  const expectedOutputData = JSON.parse(expectedOutput);

  cleanup(expectedOutputData);

  expect(JSON.stringify(expectedOutputData, null, 2)).toBe(
    JSON.stringify(output, null, 2),
  );
});

/**
 * Remove meta and sources that keeps changing
 */
function cleanup(doc: TransformedDoc) {
  const REDCATED = "__REDACTED__";

  doc.meta = {
    typedocBetterJsonVersion: REDCATED,
  };

  function removeSource(obj: any) {
    if (typeof obj === "object" && obj !== null) {
      if ("source" in obj) {
        obj.source = REDCATED;
      }
      for (const k in obj) {
        removeSource(obj[k]);
      }
    }
    if (Array.isArray(obj)) {
      obj.forEach(removeSource);
    }
  }

  removeSource(doc);
}

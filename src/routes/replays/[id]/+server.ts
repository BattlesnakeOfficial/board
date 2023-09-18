import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RequestHandler } from "./$types";

const ROOT_DIR = process.env.REPLAYS_DIR ?? process.cwd();

export const GET: RequestHandler = async ({ params }) => {
  // Load the local NDJSON 'replay' file.
  // TODO(schoon): Once we decide on a real extension, use that here.
  // Check that the file exists, and return a 404 otherwise.
  const replayFile = await readFile(join(ROOT_DIR, `${params.id}.ndjson`), "utf-8");
  const replayLines = replayFile.split("\n").filter((line) => line.trim().length);

  // TODO(schoon): This would be much better with a clear delimiter,
  // not just a gentlemen's agreement that the first line is special.
  const info = JSON.parse(replayLines[0]);
  const frames = replayLines.slice(1).map((line) => JSON.parse(line));

  return new Response(
    JSON.stringify({
      frames,
      info
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

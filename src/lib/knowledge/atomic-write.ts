import fs from "node:fs/promises";
import { nanoid } from "nanoid";

/**
 * Writes to a temp path then renames into place. `fs.rename` is atomic on the
 * same volume on both POSIX and Windows, so readers (the Viewer) never observe
 * a half-written file.
 */
export async function atomicWriteFile(targetPath: string, data: string | Buffer): Promise<void> {
  const tmpPath = `${targetPath}.tmp-${nanoid(8)}`;
  await fs.writeFile(tmpPath, data);
  await fs.rename(tmpPath, targetPath);
}

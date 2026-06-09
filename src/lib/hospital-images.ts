import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

export function hasPublicImage(src: string) {
  if (!src.startsWith("/") || src.includes("..")) {
    return false;
  }

  const publicRoot = path.resolve(process.cwd(), "public");
  const imagePath = path.resolve(publicRoot, src.slice(1));

  return imagePath.startsWith(`${publicRoot}${path.sep}`) && existsSync(imagePath);
}

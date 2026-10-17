import { openSync, readSync, closeSync } from "node:fs";
import path from "node:path";

// Reads the pixel size of a PNG under public/ at build time, so blog images can use
// next/image (which needs width/height) without storing sizes in the blog data.
export function getPublicPngSize(publicPath: string): { width: number; height: number } | null {
  if (!publicPath.toLowerCase().endsWith(".png")) return null;

  const filePath = path.join(process.cwd(), "public", decodeURI(publicPath));
  const header = Buffer.alloc(24);
  let fd: number | undefined;

  try {
    fd = openSync(filePath, "r");
    readSync(fd, header, 0, 24, 0);
  } catch {
    return null;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }

  // PNG signature, then the IHDR chunk holds width and height as big-endian uint32.
  if (header.readUInt32BE(0) !== 0x89504e47 || header.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

import crypto from "crypto";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MOCK_CDN_BASE = "/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface UploadedFile {
  hash: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  cdnUrl: string;
  localPath: string;
  width?: number;
  height?: number;
}

export async function hashFile(buffer: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function saveFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadedFile> {
  const fileHash = await hashFile(fileBuffer);
  const fileExt = path.extname(fileName);
  const localFileName = `${fileHash}${fileExt}`;
  const localPath = path.join(UPLOAD_DIR, localFileName);

  if (!fs.existsSync(localPath)) {
    fs.writeFileSync(localPath, fileBuffer);
  }

  return {
    hash: fileHash,
    fileName,
    fileSize: fileBuffer.length,
    mimeType,
    cdnUrl: `${MOCK_CDN_BASE}/${localFileName}`,
    localPath,
  };
}

export async function deleteFile(hash: string): Promise<boolean> {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    const matchingFile = files.find((f) => f.startsWith(hash));
    
    if (matchingFile) {
      fs.unlinkSync(path.join(UPLOAD_DIR, matchingFile));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export function getTierMediaLimits(tier: string): {
  maxImages: number;
  maxVideoSize: number;
} {
  switch (tier) {
    case "free":
      return { maxImages: 2, maxVideoSize: 0 };
    case "basic":
      return { maxImages: 5, maxVideoSize: 0 };
    case "vip":
      return { maxImages: 15, maxVideoSize: 50 };
    case "elite":
      return { maxImages: 30, maxVideoSize: 100 };
    default:
      return { maxImages: 2, maxVideoSize: 0 };
  }
}

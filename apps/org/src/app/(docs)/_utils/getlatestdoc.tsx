import fs from "fs";
import path from "path";

export function getLatestDoc(dirName: string) {
  const dirPath = `src/content/docs/${dirName}`;

  const files = fs.readdirSync(dirPath);
  const mdFiles = files.filter((file) => path.extname(file) === ".md");

  if (mdFiles.length === 0) {
    return dirName;
  }

  mdFiles.sort((a, b) => {
    const regex = /^\d{3}/;
    const matchA = regex.exec(a);
    const matchB = regex.exec(b);

    if (matchA && matchB) {
      const numA = parseInt(matchA[0]);
      const numB = parseInt(matchB[0]);
      return numA - numB;
    }

    return 0;
  });

  if (!mdFiles[0]) {
    return dirName;
  }

  return dirName + "/" + mdFiles[0].replace(".md", "");
}

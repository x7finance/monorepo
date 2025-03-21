import path from "path";
import { glob } from "glob";

import { SOURCE_FILES } from "~/app/(docs)/_utils/markdoc-parse";

export async function generateDocsSlugs() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**/*.md"));

  return markdownPaths.map((postPath) => {
    const startIndex = postPath.indexOf("/docs/") + "/docs/".length;
    const endIndex = postPath.lastIndexOf(".md");
    const sourceFilePath = postPath.substring(startIndex, endIndex);

    const slug = sourceFilePath
      .split("/")
      .filter(
        (slugPart, index, array) =>
          slugPart !== "" &&
          !(slugPart === "index" && index === array.length - 1),
      );

    return { slug, locale: "en" };
  });
}

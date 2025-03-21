import path from "path";
import { glob } from "glob";

import { SOURCE_FILES } from "~/app/(marketing)/blog/_utils/markdoc-parse";

export async function generateBlogPostSlugs() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**/*.md"));

  return markdownPaths.map((postPath) => {
    const startIndex = postPath.indexOf("/blog/") + "/blog/".length;
    const endIndex = postPath.lastIndexOf(".md");
    const sourceFilePath = postPath.substring(startIndex, endIndex);

    const slug = sourceFilePath.split("/").filter((slug) => slug !== "");

    return { slug, locale: "en" };
  });
}

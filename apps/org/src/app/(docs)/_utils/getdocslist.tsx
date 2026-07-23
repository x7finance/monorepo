import fs from "fs"
import path from "path"

interface FileData {
  fileName: string
}

export function docsList(dirName: string): FileData[] {
  const dirPath = `src/content/docs/${dirName}`

  const files = fs.readdirSync(dirPath)
  const mdFiles = files.filter(
    (file) => path.extname(file) === ".md" && file !== "index.md"
  )

  const fileDataList: FileData[] = mdFiles.map((file) => {
    return {
      fileName: file,
    }
  })

  return fileDataList
}

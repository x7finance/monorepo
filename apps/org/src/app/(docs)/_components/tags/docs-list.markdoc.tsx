import { docsList } from "~/app/(docs)/_utils/getdocslist"

export function DocsList({ section }: { section: string }) {
  const files = docsList(section)

  if (section === "onchains") {
    const filesByMonth: Record<string, string[]> = {}
    files.forEach((file) => {
      const month = (getMonthFromFileName(file.fileName) ?? "").toUpperCase()
      if (!filesByMonth[month]?.length) {
        filesByMonth[month] = []
      }
      filesByMonth[month].push(file.fileName)
    })

    const sortedMonths = Object.keys(filesByMonth).sort((a, b) => {
      const [monthA, yearA] = a.split("-")
      const [monthB, yearB] = b.split("-")
      if (yearA === yearB) {
        return parseInt(monthA ?? "0") - parseInt(monthB ?? "0")
      }
      return parseInt(yearB ?? "0") - parseInt(yearA ?? "0")
    })

    return (
      <div className="not-prose my-12">
        {sortedMonths.map((month) => (
          <div key={month}>
            <h2>
              <strong>{month} &#8594;</strong>
            </h2>
            {(filesByMonth[month]?.length ?? 0) > 0 && (
              <ul>
                {filesByMonth[month]?.map((fileName) => (
                  <li key={fileName}>
                    <a href={`/docs/onchains/${fileName}`}>
                      {getFormattedFileName(fileName)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <br />
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className="not-prose my-12">
        <ul>
          {files.map((file) => {
            const fileNameWithoutExtension = file.fileName.replace(/\.md$/, "")
            return (
              <li key={file.fileName}>
                <a href={`/docs/${section}/${fileNameWithoutExtension}`}>
                  {fileNameWithoutExtension}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

function getMonthFromFileName(fileName: string): string | undefined {
  const parts = fileName.split("-")
  const month = parts[1]
  const year = parts[3]
  return `${month}-${year}`
}

function getFormattedFileName(fileName: string): string {
  const parts = fileName.split("-")
  const month = parts[1]
  const day = parts[2]
  const year = parts[3]
  const time = parts[4]
  const meridiem = parts[5]
  return `${month}-${day}-${year}-${time}-${meridiem}`
}

const buildList = require("./buildList")
const fs = require("fs")
const path = require("path")

const outDir = `../build`
const fileName = `xchange-default.tokenlist.json`

try {
  fs.mkdirSync(path.join(__dirname, outDir), { recursive: true })
} catch (e) {
  console.error("Directory creation error: ", e)
}

buildList().then((data) =>
  fs.writeFileSync(
    path.join(__dirname, outDir, fileName),
    JSON.stringify(data, null, 2)
  )
)

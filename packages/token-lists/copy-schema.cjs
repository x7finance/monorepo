const fs = require("fs");

const source = "src/tokenlist.schema.json";
const destination = "dist/tokenlist.schema.json";

fs.copyFileSync(source, destination);

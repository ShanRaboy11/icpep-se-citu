// Fails if the client/server copies of these utils drift apart.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pairs = [
  [
    "client/src/app/utils/academic-year.ts",
    "server/src/utils/academic-year.ts",
  ],
  [
    "client/src/app/officers/utils/format-name.ts",
    "server/src/utils/format-name.ts",
  ],
];

const normalize = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/'/g, '"')
    .replace(/,\s*([)\]}])/g, "$1")
    .replace(/\s+/g, "");

let failed = false;
for (const [clientFile, serverFile] of pairs) {
  const client = normalize(fs.readFileSync(path.join(root, clientFile), "utf8"));
  const server = normalize(fs.readFileSync(path.join(root, serverFile), "utf8"));
  if (client !== server) {
    failed = true;
    console.error(`OUT OF SYNC: ${clientFile} <-> ${serverFile}`);
  }
}

if (failed) process.exit(1);
console.log("Mirrored utils are in sync.");

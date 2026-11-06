#!/usr/bin/env node
"use strict";

/*
 * Compatibility helper for New-Data.
 *
 * This file intentionally does not invent native offsets.
 * It records the target libg.so metadata and prepares mapping data
 * for signatures that can be verified against the target binary.
 */

const fs = require("fs");
const crypto = require("crypto");

const libPath = process.argv[2] || "libg.so";
const mapPath = process.argv[3] || "offset-map.json";

if (!fs.existsSync(libPath)) {
  console.error("Missing " + libPath);
  process.exit(1);
}

const data = fs.readFileSync(libPath);
const map = fs.existsSync(mapPath)
  ? JSON.parse(fs.readFileSync(mapPath, "utf8"))
  : { version: 1, mappings: {} };

map.libg = map.libg || {};
map.libg.sha256 = crypto.createHash("sha256").update(data).digest("hex");
map.libg.size = data.length;

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + "\n");
console.log("Updated " + mapPath + " for " + libPath);

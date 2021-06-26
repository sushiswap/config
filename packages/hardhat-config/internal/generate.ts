import { readFile, writeFile } from "fs/promises";

import fetch from "node-fetch";
import isEqual from "lodash/isEqual";
import { resolve } from "path";
import template from "./template";

// 1. Get chain data and store it
// 2. Use chain data to fill out networks array of hh config
// 3. ...

(async () => {
  // Fetch JSON from https://chainid.network/chains.json
  const res = await fetch("https://chainid.network/chains.json");

  if (res.status === 200 && res.statusText === "OK") {
    const latest = await res.json();

    const path = resolve(__dirname, "../data/chains.json");

    try {
      await readFile(path);
    } catch (error) {
      await writeFile(path, JSON.stringify(latest, null, 2));
    }

    const stored = await readFile(path, { encoding: "utf8" });

    if (isEqual(stored, latest)) {
      console.log("Chains data is up to date");
    } else {
      console.log("Chains data needs updating...");
      await writeFile(path, JSON.stringify(latest, null, 2));
    }
  }
})();

// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, green, walk, globToRegExp, readFileStr } from "../deps.ts";

import { setupLog } from "./log.ts";

interface Import {
  what: string;
  from: string;
  in: string;
}

const reImport = new RegExp(
  /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/,
  "mg",
);
const reImportD = new RegExp(
  /import\((?:["'\s]*([\w*{}\n\r\t, ]+)\s*)?["'\s](.*([@\w_-]+))["'\s].*\);$/,
  "mg",
);
const reURL = new RegExp(
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%@_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/,
  "i",
);

function validURL(url: string) {
  return !!reURL.test(url);
}

async function read(file: string): Promise<Import[]> {
  const source = await readFileStr(file);
  const imports: Import[] = [];

  let match;
  while ((match = reImport.exec(source)) !== null) {
    if (validURL(match[2])) {
      imports.push({
        what: match[1],
        from: match[2],
        in: file
      });
      console.log(match[1]);
    }
  }

  while ((match = reImportD.exec(source)) !== null) {
    if (validURL(match[1])) {
      imports.push({
        what: "ALL",
        from: match[1],
        in: file
      });
    }
  }

  return imports;
}

if (import.meta.main) {
  await setupLog();

  let path = Deno.cwd();
  if (Deno.args.length) {
    path = Deno.args[0];
  }

  const ride = walk(path, {
    maxDepth: Infinity,
    includeFiles: true,
    includeDirs: false,
    followSymlinks: false,
    exts: ["ts", "js", "tsx", "jsx"],
    match: [globToRegExp("**/*.*")],
    skip: [globToRegExp("**/.git/**")],
  });

  const res = [];
  for await (const entry of ride) {
    res.push(read(entry.path));
  }

  const found = await Promise.all(res);
  const imports = [];
  for (const row of found) for (const e of row) imports.push(e);

  log.info(`You have ${green(imports.length.toString())} imports from the web`)
}

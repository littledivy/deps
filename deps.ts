// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

// provide better logging, see src/log.ts
export * as log from "https://deno.land/std@0.53.0/log/mod.ts";
export { LogRecord } from "https://deno.land/std@0.53.0/log/logger.ts";
export { LogLevels } from "https://deno.land/std@0.53.0/log/levels.ts";
export { BaseHandler } from "https://deno.land/std@0.53.0/log/handlers.ts";

// colors
export {
  reset,
  bold,
  blue,
  yellow,
  red,
  green,
} from "https://deno.land/std@0.53.0/fmt/colors.ts";

// find and read files
export { walk } from "https://deno.land/std@0.53.0/fs/walk.ts";
export { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
export { globToRegExp } from "https://deno.land/std@0.53.0/path/glob.ts";
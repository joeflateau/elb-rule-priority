#!/usr/bin/env node

import { spawnSync } from "child_process";
import * as path from "path";
import { findPriority } from "./findPriority";

export * from "./findPriority";

async function run(listenerArn: string, hostname: string) {
  const priority = await findPriority(listenerArn, hostname);
  console.log(priority);
}

if (require.main === module) {
  const [, , listenerArn, hostname] = process.argv;
  run(listenerArn, hostname);
}

export function getPrioritySync(listenerArn: string, hostname: string) {
  const scriptPath = path.join(__dirname, "./index.js");
  return Number(spawnSync(scriptPath, [listenerArn, hostname]).stdout);
}

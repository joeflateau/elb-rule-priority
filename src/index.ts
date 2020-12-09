#!/usr/bin/env node

import { spawnSync } from "child_process";
import { findPriority } from "./findPriority";

async function run(listenerArn: string, hostname: string) {
  const priority = await findPriority(listenerArn, hostname);
  console.log(priority);
}

if (require.main === module) {
  const [, , listenerArn, hostname] = process.argv;
  run(listenerArn, hostname);
}

export function getPrioritySync(listenerArn: string, hostname: string) {
  return Number(
    spawnSync(`npx`, ["elb-rule-priority", listenerArn, hostname]).stdout
  );
}

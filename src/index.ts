#!/usr/bin/env node

import { findPriority } from "./findPriority";

async function run(listenerArn: string, hostname: string) {
  const priority = await findPriority(listenerArn, hostname);
  console.log(priority);
}

if (require.main === module) {
  const [, , listenerArn, hostname] = process.argv;
  run(listenerArn, hostname);
}

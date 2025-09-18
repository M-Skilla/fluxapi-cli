import { Command } from "commander";

import saveCmd from "./commands/save";
import listCmd from "./commands/list";
import deleteCmd from "./commands/delete";
import requestCmd from "./commands/request";
import chalk from "chalk";
import exportCmd from "./commands/export";

const program = new Command();

export interface RequestOptions {
  method: string;
  body?: string;
  header?: string[];
  query?: string[];
  token?: string;
}

program
  .name("fluxapi")
  .description(
    "A lightweight, cross-platform command-line interface for interacting with APIs."
  )
  .version("1.0.0");

program.addCommand(saveCmd);
program.addCommand(listCmd);
program.addCommand(deleteCmd);
program.addCommand(requestCmd);
program.addCommand(exportCmd);

process.on('uncaughtException', (error) => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
      console.error(chalk.yellow("👋 See you later..."));
  } else {
    // Rethrow unknown errors
    throw error;
  }
});

program.parse(process.argv);

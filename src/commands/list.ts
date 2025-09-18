import { Command } from "commander";
import { listRequests } from "../utils/store";
import chalk from "chalk";

const listCmd = new Command("list");

listCmd.description("List all saved requests").action(() => {
  const requests = listRequests();

  if (requests.length === 0) {
    console.log(chalk.yellow("No saved requests found."));
    return;
  }

  requests.forEach((req) => {
    console.log(chalk.green("Saved Requests:"));
    requests.forEach((r) => console.log(`- ${r}`));
  });
});

export default listCmd;

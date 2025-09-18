import { Command } from "commander";
import { getRequest } from "../utils/store";
import { generateSnippet } from "../utils/snippet-generator";
import clipboardy from "clipboardy";
import chalk from "chalk";

const exportCmd = new Command("export");

exportCmd
  .description("Export a saved request to code snippets in different languages/frameworks")
  .argument("<name>", "Name of the saved request")
  .option("-l, --language <lang>", "Target language/framework\nSupported languages: curl, fetch/javascript, axios, python/requests, java/okhttp, go/golang, php, csharp/c#, ruby, swift, kotlin, rust", "curl")
  .option("--copy", "Copy the generated snippet to clipboard", false)
  .action(async (name: string, options: { language: string; copy: boolean }) => {
    const request = getRequest(name);

    if (!request) {
      console.error(`No saved request found with name: ${name}`);
      process.exit(1);
    }

    const snippet = generateSnippet(request, options.language);
    console.log(chalk.blueBright(`--- Generated ${options.language} snippet for request '${name}' ---`));
    console.log(snippet);
    console.log(chalk.blue("------------------------------------------------------------"));
    if (options.copy) {
      try {
        await clipboardy.write(snippet);
        console.log(chalk.blue("Snippet copied to clipboard!"));
      } catch (err) {
        console.error(chalk.red("Failed to copy to clipboard. Something went wrong."));
      }
    }
  });

export default exportCmd;
import { Command } from "commander";
import { RequestOptions } from "..";
import { saveRequest } from "../utils/store";
import chalk from "chalk";

const saveCmd = new Command("save");

saveCmd
  .description("Save a request configuration for future use")
  .argument("<name>", "Name to save the request under")
  .argument("<url>", "URL to send the request to")
  .option("-m, --method <method>", "HTTP method to use", "GET")
  .option("-H, --header <header...>", "Headers to include in the request")
  .option(
    "-q, --query <query...>",
    "Query parameters to include in the request"
  )
  .option("-b, --body <body>", "Body to send with the request")
  .option(
    "-t, --token <token>",
    "Authentication token to include in the request"
  )
  .action(async (name: string, url: string, options: RequestOptions) => {
    const headers: Record<string, string> = {};
    const queryParams: Record<string, string> = {};
    const body = options.body ? JSON.parse(options.body) : undefined;

    if (options.headers) {
      options.headers.forEach((header) => {
        const [key, value] = header.split("=");
        headers[key.trim()] = value.trim();
      });
    }

    if (options.query) {
      options.query.forEach((param) => {
        const [key, value] = param.split("=");
        queryParams[key.trim()] = value.trim();
      });
    }

    await saveRequest(name, {
      url,
      method: options.method || "GET",
      data: body,
      headers,
      queryParams,
      authToken: options.token,
    });

  });

export default saveCmd;

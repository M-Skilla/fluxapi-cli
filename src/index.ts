import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";
import { colorize } from "json-colorizer";

import { formatStatus } from "./utils/lib";
import { getRequest } from "./utils/store";

const program = new Command();

interface RequestOptions {
    method?: string;
    body?: string;
    headers?: string[];
    query?: string[];
    token?: string;
}

program
    .name("fluxapi")
    .description("A lightweight, cross-platform command-line interface for interacting with APIs.")
    .version("1.0.0")
    .argument("<url>", "URL to send the request to")
    .option("-m, --method <method>", "HTTP method to use", "GET")
    .option("-H, --header <header...>", "Headers to include in the request")
    .option("-q, --query <query...>", "Query parameters to include in the request")
    .option("-b, --body <body>", "body to send with the request")
    .option("-t, --token <token>", "Authentication token to include in the request")
    .action(async (url: string, options: RequestOptions) => {
        const spinner = ora(`Sending request...`).start();

        try {
            let { method = "GET" } = options;
            let finalUrl = url;
            let headers: Record<string, string> = {};
            let queryParams: Record<string, string> = {};
            let body: any = options.body ? JSON.parse(options.body) : undefined;

            if (url.startsWith("@")) {
                const name = url.slice(1);
                const savedRequest = getRequest(name);

                if (!savedRequest) {
                    spinner.fail(`No saved request found with the name: ${name}`);
                    process.exit(1);
                }

                method = savedRequest.method || method;
                finalUrl = savedRequest.url;
                body = savedRequest.data || body;
                headers = { ...headers, ...(savedRequest.headers || {}) };
                queryParams = { ...queryParams, ...(savedRequest.queryParams || {}) };
                if (savedRequest.authToken) {
                    headers["Authorization"] = `Bearer ${savedRequest.authToken}`;
                }
            }

            if (options.token) {
                headers["Authorization"] = `Bearer ${options.token}`;
            }

            if (options.headers) {
                options.headers.forEach(header => {
                    const [key, value] = header.split("=");
                    headers[key.trim()] = value.trim();
                });
            }

            if (options.query) {
                options.query.forEach(param => {
                    const [key, value] = param.split("=");
                    queryParams[key.trim()] = value.trim();
                });
            }

            const res = await axios({
                method,
                url: finalUrl,
                headers,
                params: queryParams,
                data: body
            })

            spinner.succeed(chalk.green(`Request successful!`));
            console.log(chalk.blue("Status: "), formatStatus(res.status, res.statusText));
            console.log(chalk.blue("Response: "), colorize(res.data));
        } catch (error: any) {
            spinner.fail(`Request failed`);
            console.error(chalk.red("Error: "), error.message);
        }
    });


program.parse(process.argv);
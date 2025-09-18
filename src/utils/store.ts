import chalk from "chalk";
import Conf from "conf";
import { confirm } from "@inquirer/prompts";

interface savedRequest {
  url: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  authToken?: string;
}

const store = new Conf<{ requests: Record<string, savedRequest> }>({
  projectName: "fluxapi",
  defaults: { requests: {} },
});

export const saveRequest = (name: string, request: savedRequest) => {
  const requests = store.get("requests");
  if (requests[name]) {
    const overwrite = confirm({ message: `Overwrite request '${name}'?`, default: false });
    if (!overwrite) {
      console.log(chalk.red("Operation cancelled."));
      return;
    }
  }
  requests[name] = request;
  store.set("requests", requests);
};

export const getRequest = (name: string): savedRequest | undefined => {
  const requests = store.get("requests");
  return requests[name];
};

export const listRequests = (): string[] => {
  const requests = store.get("requests");
  return Object.keys(requests);
};

export const deleteRequest = (name: string): boolean => {
  const requests = store.get("requests");
  if (requests[name]) {
    delete requests[name];
    store.set("requests", requests);
    return true;
  }
  return false;
};

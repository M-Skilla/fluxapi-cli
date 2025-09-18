import { Command } from "commander";
import { deleteRequest } from "../utils/store";

const deleteCmd = new Command('delete');

deleteCmd
  .description("Delete a saved request configuration")
  .argument("<name>", "Name of the saved request to delete")
  .action((name: string) => {
    const success = deleteRequest(name);

    if (success) {
      console.log(`Request '${name}' deleted successfully.`);
    } else {
      console.log(`No saved request found with the name '${name}'.`);
    }
  });

export default deleteCmd;
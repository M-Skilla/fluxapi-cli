import chalk from "chalk";

export function formatStatus(code: number, text: string): string {
  let color: any;
  if (code >= 200 && code < 300) {
    color = chalk.green;
  } else if (code >= 300 && code < 400) {
    color = chalk.yellow;
  } else if (code >= 400 && code < 500) {
    color = chalk.red;
  } else if (code >= 500) {
    color = chalk.magenta;
  } else {
    color = chalk.gray;
  }
  const codeStr = color(code.toString());
  return `${codeStr} ${color(text)}`;
}

import { readline } from "dependencies";

export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = async (text: string) => {
  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      resolve(answer);
    });
  });
};

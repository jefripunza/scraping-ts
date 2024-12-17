import {
  axios,
  puppeteerExtra,
  StealthPlugin,
  type PuppeteerNode,
} from "dependencies.ts"; // Gunakan puppeteer jika compatible dengan BunJS
import projects from "./projects/index.ts";
import { question } from "function.ts";

// select project ...
for (let i = 0; i < projects.length; i++) {
  const project = projects[i];
  console.log(`${i + 1}. ${project.name}`);
}

const project_select = await question("Select your project: ");
const project = projects[Number(project_select) - 1];
if (Number(project_select) < 1 || !project) {
  console.log("Project not found !!");
  process.exit(1);
}

console.log(`✅ Selected project: ${project.name}`);

// execute ...
const puppeteer = puppeteerExtra as unknown as PuppeteerNode & {
  use: (plugin: any) => void;
};
// Tambahkan plugin stealth
puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({
  headless: false,
  acceptInsecureCerts: true,
  args: [
    "--disable-geolocation",
    // "--disable-web-security",
    // "--disable-features=IsolateOrigins,site-per-process",
  ],
});
const page = await browser.newPage(); // buka halaman baru
// await page.setUserAgent(
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
// );
await page.setViewport({ width: 1366, height: 768 });
await page.setJavaScriptEnabled(true);
if (Object.keys(project.options?.extra_headers || {}).length > 0) {
  await page.setExtraHTTPHeaders((project.options?.extra_headers as any) || {});
}
await page.goto(project.url); // buka halaman project

const scrape = await project.scrape_cb(browser, page); // eksekusi scrape
console.log({ scrape });

await Bun.write(
  `./${project.name.toLowerCase()}.json`,
  JSON.stringify(scrape, null, 2)
);

const processing = await project.processing_cb(scrape); // eksekusi processing
console.log({ processing });

// await browser.close();

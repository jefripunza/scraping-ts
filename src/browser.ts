import {
  PuppeteerNode,
  puppeteerExtra,
  StealthPlugin,
  type Browser,
  type Page,
  fs,
  path,
} from "dependencies";
import { os } from "constant";

const puppeteer = puppeteerExtra as unknown as PuppeteerNode & {
  use: (plugin: any) => void;
};

// Tambahkan plugin stealth
puppeteer.use(StealthPlugin());

export const drivers: {
  [key: string]: Browser;
} = {};

const setupThrottle = async (
  page: Page,
  speed: "Slow 3G" | "Fast 3G" | "Offline"
) => {
  const networkConditions: {
    offline: boolean;
    latency: number;
    download_throughput: number;
    upload_throughput: number;
  } = {
    "Slow 3G": {
      offline: false,
      latency: 400, // ms
      download_throughput: (500 * 1024) / 8, // 500 kbps
      upload_throughput: (500 * 1024) / 8, // 500 kbps
    },
    "Fast 3G": {
      offline: false,
      latency: 150, // ms
      download_throughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      upload_throughput: (750 * 1024) / 8, // 750 kbps
    },
    Offline: {
      offline: true,
      latency: 0,
      download_throughput: 0,
      upload_throughput: 0,
    },
  }[speed];

  // Atur kondisi jaringan dengan menggunakan emulasi
  await page.setOfflineMode(networkConditions.offline);
  await page.emulateNetworkConditions({
    download: networkConditions.download_throughput,
    upload: networkConditions.upload_throughput,
    latency: networkConditions.latency,
  });

  console.log(`Network throttling set to: ${speed}`);
};

export const GetDriver = async (code: string): Promise<Browser> => {
  let driver = drivers[code];
  if (driver) {
    console.log(`Browser [${code}] already initialized`);
    return driver;
  }

  try {
    let executablePath: string | undefined;
    if (os == "windows") {
      const USERPROFILE = Deno.env.get("USERPROFILE");
      const chrome_path = path.join(
        USERPROFILE as string,
        ".cache",
        "puppeteer",
        "chrome"
      );
      const latest_chrome = fs.readdirSync(chrome_path).reverse();
      executablePath = path.join(
        chrome_path,
        latest_chrome[0],
        "chrome-win64",
        "chrome.exe"
      );
    } else if (os == "linux") {
      const HOME = Deno.env.get("HOME");
      const chrome_path = path.join(
        HOME as string,
        ".cache",
        "puppeteer",
        "chrome"
      );
      console.log("chrome_path:", chrome_path);
      const latest_chrome = fs.readdirSync(chrome_path).reverse();
      executablePath = path.join(
        chrome_path,
        latest_chrome[0],
        "chrome-linux64",
        "chrome"
      );
    } else if (os == "darwin") {
      executablePath =
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    }
    console.log("executablePath:", executablePath);

    // Meluncurkan browser Puppeteer dengan opsi
    driver = await puppeteer.launch({
      headless: false, // Ganti ke true jika ingin menjalankan dalam mode headless
      args: [
        "--disable-gpu", // Menonaktifkan GPU untuk stabilitas
        "--no-sandbox", // Menonaktifkan sandbox
        "--disable-setuid-sandbox", // Menonaktifkan setuid sandbox
        "--disable-dev-shm-usage", // Menghindari masalah memori bersama
      ],
      executablePath,
    });

    drivers[code] = driver; // Simpan instance browser

    return driver; // Kembalikan instance browser
  } catch (error) {
    throw new Error(`Failed to initialize driver: ${error}`);
  }
};

// Actions ...

export const wait = async (milliseconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const waitUntilElement = async (
  page: Page,
  selector: string,
  timeout = 1000
) => {
  try {
    await page.waitForSelector(selector, { timeout }); // Tunggu hingga elemen tersedia
  } catch {
    console.error(`Element not found: ${selector}`);
    await waitUntilElement(page, selector);
  }
};

export const waitForElement = async (
  page: Page,
  message: string,
  selector: string,
  timeout = 1000
) => {
  try {
    console.log("Waiting for:", message);
    await page.waitForSelector(selector, { timeout }); // Tunggu hingga elemen tersedia
  } catch {
    console.error(`Element not found: ${selector}`);
  }
};

export const click = async (page: Page, selector: string) => {
  await waitForElement(page, `Clicking [${selector}]`, selector);
  await page.click(selector); // Mengklik elemen
};

export const input = async (
  page: Page,
  selector: string,
  text: string,
  defaultValue?: string,
  query: Record<string, string> = {},
  body: Record<string, string> = {}
) => {
  // Menggantikan placeholder dalam teks dengan nilai dari query dan body
  text = text.replace(/(query|body):(\w+)/g, (_, type, key) => {
    if (type === "query" && key in query) {
      return query[key];
    } else if (type === "body" && key in body) {
      return body[key];
    }
    return ""; // Kembalikan string kosong jika tidak ditemukan
  });
  text = text && text.trim().length > 0 ? text : defaultValue || "";
  // jika di dalam string ada query:<key> maka replace, body juga sama
  await waitForElement(
    page,
    `Inputting text to [${selector}] on value "${text}"`,
    selector
  );
  await page.type(selector, text, { delay: 100 });
};

export const submit = async (page: Page, selector: string) => {
  await waitForElement(page, `Submitting [${selector}]`, selector);
  await page.click(selector); // Mengklik elemen untuk submit
};

export const scroll = async (page: Page, scroll_value: number) => {
  await page.evaluate((scrollValue) => {
    (window as any).scrollBy(0, scrollValue);
  }, scroll_value);
};

export const getElement = async (page: Page, selector: string) => {
  try {
    return await page.$(selector); // Mengambil elemen
  } catch {
    return null; // Kembalikan null jika tidak ditemukan
  }
};

export const getMessage = async (page: Page, selector: string) => {
  const element = await getElement(page, selector);
  return element ? await page.evaluate((el) => el.innerHTML, element) : null; // Ambil konten innerHTML
};

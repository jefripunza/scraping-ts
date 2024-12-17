import Project from "@project";
import { delay, question } from "function";

const project = new Project("Airbnb.com (Hotel)", "https://www.airbnb.com/");

interface Data {
  title: string;
  url: string;
  description?: string;
  price: string;
  address: string;
  property_type?: string;
  images?: string[];
}

project.scrape(async (browser, page): Promise<Data[]> => {
  const location = (await question("Typing location: ")) as string;
  await page.type("#bigsearch-query-location-input", location);
  await delay(1000);
  await page.click(
    "button[data-testid='structured-search-input-search-button']"
  );

  await page.waitForSelector("a[aria-label='Next']");
  const max_page = await page.evaluate(() => {
    const nextButton = document.querySelector('a[aria-label="Next"]');
    if (nextButton) {
      const previousPage = nextButton.previousElementSibling as HTMLElement;
      if (previousPage && previousPage.textContent) {
        return parseInt(previousPage.textContent.trim(), 10);
      }
    }
    return 1; // default to 1 if no "Next" button or page number found
  });

  let limit_page: number;

  // Validate limit_page input to ensure it's within the valid range and is a number
  while (true) {
    const input = (await question(`Limit page (max: ${max_page}): `)) as string;
    limit_page = parseInt(input, 10);

    // Check if input is a valid number and is within the range
    if (!isNaN(limit_page) && limit_page >= 1 && limit_page <= max_page) {
      break; // exit the loop if valid input
    } else {
      console.log(`Please enter a valid number between 1 and ${max_page}`);
    }
  }

  const results: Data[] = [];

  // loop semua card

  // Get results data
  const data = await page.evaluate(async (limit_page) => {
    function getElementsByXPath(xpath: string): HTMLElement[] {
      const result: HTMLElement[] = [];
      const nodesSnapshot = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
        const element = nodesSnapshot.snapshotItem(i) as HTMLElement;
        if (element) {
          result.push(element);
        }
      }
      return result;
    }
    const delay = async (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const result: Data[] = [];

    for (let pageNum = 1; pageNum <= limit_page; pageNum++) {
      const listings = getElementsByXPath(
        "//*[@id='site-content']/div/div[2]/div/div/div/div/div/*"
      );

      let url_save = "";
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        const title =
          listing
            .querySelector("div[data-testid='listing-card-title']")
            ?.textContent?.trim() || "";
        const url = listing.querySelector("a")?.getAttribute("href") || "";
        if (i === 0) {
          url_save = url;
        }
        let price = "";
        let priceElement = listing.querySelector(
          "div[data-testid='price-availability-row']"
        );
        if (priceElement) {
          priceElement = priceElement
            .querySelectorAll("div")[1]
            .querySelector("div > div > div > span > div > span");
          if (priceElement) {
            price = priceElement.textContent?.trim() || "";
          }
        }
        const address =
          listing
            .querySelector("span[data-testid='listing-card-name']")
            ?.textContent?.trim() || "";

        result.push({
          title,
          url,
          price,
          address,
        });
      }

      // Handle next page
      // @ts-ignore
      const room_code = String(url_save).split("?")[0];
      const nextButton = document.querySelector("a[aria-label='Next']");
      if (nextButton) {
        // @ts-ignore
        nextButton.click();
        // Wait for the next page to load
        await new Promise((resolve) => {
          const interval = setInterval(async () => {
            if (
              document.querySelector("div[data-testid='listing-card-title']")
            ) {
              await delay(500);
              clearInterval(interval);
              resolve(null);
            }
          }, 1000); // Check every second until the page is loaded
        });
      } else {
        break; // No next page available, exit the loop
      }
    }

    return result;
  }, limit_page); // Pass limit_page as an argument to the page.evaluate function

  results.push(...(data as Data[]));

  return results;
});

project.processing<Data[]>(async (rows: any) => {
  //
});

export default project;

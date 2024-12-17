import Project from "@project";
import { delay, question } from "function";

const project = new Project("Yell.com (Hotel)", "https://www.yell.com/");

interface Data {
  url: string;
  title: string;
  description: string;
  price: string;
  address: string;
  property_type: string;
}

project.scrape(async (browser, page): Promise<Data[]> => {
  while (true) {
    const keyword = (await question("Typing keyword: ")) as string;
    const location = (await question("Typing location: ")) as string;
    await page.type("input[name='keywords']", keyword);
    await page.type("input[name='location']", location);
    await delay(1000);
    await page.click("button[title='Search now']");

    await page.setGeolocation({
      latitude: 40.7128, // Example: New York latitude
      longitude: -74.006, // Example: New York longitude
    });
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().includes("geolocation")) {
        request.respond({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            allow: true, // Automatically accept the geolocation request
          }),
        });
      } else {
        request.continue();
      }
    });

    await page.waitForSelector("section[role='main']");

    // Move this logic inside page.evaluate
    const isNoCover = await page.evaluate(() => {
      const h1 = document.querySelector(
        "body > section > div > div > div > h1"
      );
      return h1 && h1.textContent?.startsWith("No cover");
    });

    if (isNoCover) {
      console.log("No cover");
      await delay(3000);
      await page.click(
        "#site-header > div.headerBar--secondRow > div > div > div.col-sm-2.col-md-2.col-lg-2 > a > div"
      );
    } else {
      break;
    }
  }

  // scrape jumlah page
  const results: Data[] = [];

  return results;
});

project.processing<Data[]>(async (rows: any) => {
  //
});

export default project;

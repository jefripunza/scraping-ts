import Project from "@project";
import { delay } from "function";

const project = new Project(
  "Zillow.com (Agents. Tours. Loans. Homes.)",
  "https://www.zillow.com/",
  {
    extra_headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      cookie:
        "pxcts=440d7f63-bc70-11ef-ac4c-44bd25950ae4; _pxvid=440d736a-bc70-11ef-ac4c-241d9a549421; zguid=24|%2456370a32-f81a-49f3-8a1d-509ff1a60b05; zgsession=1|a70b5042-9cec-4bd8-add6-ee02f203ae12; _ga=GA1.2.1458715303.1734437588; _gid=GA1.2.1868422561.1734437588; zjs_anonymous_id=%2256370a32-f81a-49f3-8a1d-509ff1a60b05%22; zjs_user_id=null; zg_anonymous_id=%222ab15558-a11e-45a7-948f-562a6317a6ed%22; JSESSIONID=D1896B4CF5CE2422B22B7EC17B06DACB; _gcl_au=1.1.1337874399.1734437590; _rdt_uuid=1734437589666.aeefea77-0e53-4a97-850c-e999e6ab9c93; _fbp=fb.1.1734437589864.62754304295439841; DoubleClickSession=true; _tt_enable_cookie=1; _ttp=dUwgDataGPFWNaJkFzYoaqxUIoo.tt.1; tfpsi=07b48777-1d8f-4f66-b087-6c7821dd1c73; _pin_unauth=dWlkPU5EVTFOR05rTnpNdE1UZzVaQzAwT0RBMkxXRTJZbUl0TXpWallqUm1NR0V3TlRkaw; _scid=G8PdFoCTdRpETtl_96b0uBPYmZFhWhwN; _scid_r=G8PdFoCTdRpETtl_96b0uBPYmZFhWhwN; _clck=o2y2da%7C2%7Cfrs%7C0%7C1812; _uetsid=47c79200bc7011ef8c288bfe9c699903; _uetvid=47c7ad20bc7011ef88c0c10304ce447c; AWSALB=QrTfnMUAQFqDCO7ToBIg9B1XcDcfjoEEQn1stf3KrOJgJ4plAjQ+oqwQ1ie80v0tYSVQ1b4R+5M3wCPK7sgptY5KNhofw9E4P37lJNI8JHjY0CL72ariZXVpFPAr; AWSALBCORS=QrTfnMUAQFqDCO7ToBIg9B1XcDcfjoEEQn1stf3KrOJgJ4plAjQ+oqwQ1ie80v0tYSVQ1b4R+5M3wCPK7sgptY5KNhofw9E4P37lJNI8JHjY0CL72ariZXVpFPAr; _clsk=1deksir%7C1734437592533%7C1%7C0%7Ct.clarity.ms%2Fcollect; _px3=060afb2e67fa06237bfe6ac9e7033e28e2523d879d8c69df7d6bcaf0f9a0dca3:0usZIeMaCifr5UHBSptBQVvTFL7wl5lBgJE/qjmeQ6LYpMT1qs0k5pxoMnqyWVK9c1XfA5gA32SQgh3ewDNpZQ==:1000:3FhZ81BsikuGm5HCr8U3U4onlrwTa5Nuha9brXGYlGSwePmq0O0l1kd6fK2eqVzcwcfzBjjrex+GJLw8uAWLhT1tftl+dTAm+MIc4KvlQdmh4AbuJ1DRgYx+41/yi+G179aOyDXkdrQSz/enjbW30WdHJWEnF9ZiyMeubSEJrElXw4UVNWPagED1UAU1QzBQZSwjcfBHq/Gz97NX9aXoS+h1c73csGiPyLGD6Ewa2LI=; _dd_s=rum=0&expire=1734438491610",
      priority: "u=0, i",
      dnt: "1",
      "upgrade-insecure-requests": "1",
      referer: "https://www.zillow.com/homes/for_sale/",
      "sec-ch-ua":
        'Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
    },
  }
);

interface Data {
  url: string;
  title: string;
  description: string;
  price: string;
  address: string;
  property_type: string;
}

project.scrape(async (browser, page): Promise<Data[]> => {
  // ketik "New York" dalam pencarian di Zillow.com
  await delay(3000);
  await page.type("input[aria-label='Search']", "New York");
  await delay(1000);
  await page.keyboard.press("Enter");

  // scrape jumlah page

  const results: Data[] = [];

  return [];
});

project.processing<Data[]>(async (rows: any) => {
  //
});

export default project;

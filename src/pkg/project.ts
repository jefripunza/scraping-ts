import { type Browser, type Page } from "dependencies";

type ExportTo = "csv" | "json" | "pdf";

interface ProjectOption {
  proxy?: string[];
  export_to?: ExportTo;
  extra_headers?: Record<string, string>;
}

// Callback types
interface ScrapeCallback {
  (browser: Browser, page: Page): Promise<any>;
}

interface ProcessingCallback<Data> {
  (data: Data): any;
}

class Project {
  name: string;
  url: string;
  options?: ProjectOption;
  constructor(name: string, url: string, options?: ProjectOption) {
    this.name = name;
    this.url = url;
    this.options = options;
  }

  // Scrape function using Puppeteer
  scrape_cb!: ScrapeCallback;
  scrape(cb: ScrapeCallback): void {
    this.scrape_cb = cb;
  }

  // Data processing
  processing_cb!: ProcessingCallback<any>;
  processing<T>(cb: ProcessingCallback<T>): void {
    this.processing_cb = cb;
  }
}

export default Project;

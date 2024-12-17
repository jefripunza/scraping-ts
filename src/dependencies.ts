// Node
export { default as process } from "node:process";
export { default as fs } from "node:fs";
export { default as path } from "node:path";
export type { AddressInfo } from "node:net";

// Tool
export { default as axios } from "axios";
export { default as readline } from "node:readline";
export { forOwn } from 'lodash-es';

// Generate & Encryption
export { v4 as uuidv4, v7 as uuidv7 } from "uuid";

// Environment
export { default as dotenv } from "dotenv";

// Server
// @@deno-types="@types/express@4.17.21"
// export { default as express, Router } from "express";
// @@deno-types="@types/express@4.17.21"
// export type { Request, Response, NextFunction, Express } from "express";
// export {
//   ReasonPhrases,
//   StatusCodes,
//   getReasonPhrase,
//   getStatusCode,
// } from "http-status-codes";

// Middlewares
// export { default as cors } from "cors";
// export type { CorsOptions } from "cors";
// export { default as helmet } from "helmet";
// export type { HelmetOptions } from "helmet";
// export { default as morgan } from "morgan";
// export type { StreamOptions } from "morgan";
// export { default as cookieParser } from "cookie-parser";
// export type { CookieParseOptions } from "cookie-parser";
// //
// export { default as asyncHandler } from "express-async-handler";

// Database
// export { default as mongodb } from "mongodb";
// export type { Db } from "mongodb";

// export { default as puppeteer } from "puppeteer";
export type { PuppeteerNode, Browser, Page, Cookie } from "puppeteer";
export { default as puppeteerExtra } from "puppeteer-extra";
export { default as StealthPlugin } from "puppeteer-extra-plugin-stealth";

export * as cheerio from "cheerio";

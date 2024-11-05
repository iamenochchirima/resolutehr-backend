// import path from "path";

// import { Request, Response } from "express";
// import puppeteer from "puppeteer";
// import { mainPdfTemplate } from "../pdf/mainTemplate";
// import { metricPdfTemplate } from "../pdf/metricTemplate";

// const basePath = path.join(__dirname, "../pdfs");
// const mainPdfPath = path.join(basePath, "result.pdf");
// const metricPdfPath = path.join(basePath, "metric.pdf");

// export const createPdf = async (req: Request, res: Response) => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(mainPdfTemplate(req.body));

//     const fs = require("fs");
//     if (!fs.existsSync(basePath)) {
//       fs.mkdirSync(basePath, { recursive: true });
//     }

//     await page.pdf({
//       path: mainPdfPath,
//       format: "A4",
//     });

//     await browser.close();
//     res.send("PDF created successfully!");
//   } catch (error) {
//     console.error("Error creating PDF:", error);
//     res.status(500).send("Failed to create PDF");
//   }
// };

// export const fetchPDF = async (req: Request, res: Response) => {
//   const fs = require("fs");
//   if (fs.existsSync(mainPdfPath)) {
//     res.sendFile(mainPdfPath);
//   } else {
//     console.error("PDF file not found at:", mainPdfPath);
//     res.status(404).send("PDF file not found");
//   }
// };

// export const createMetricPdf = async (req: Request, res: Response) => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(metricPdfTemplate(req.body));

//     const fs = require("fs");
//     if (!fs.existsSync(basePath)) {
//       fs.mkdirSync(basePath, { recursive: true });
//     }

//     await page.pdf({
//       path: metricPdfPath,
//       format: "A4",
//     });

//     await browser.close();
//     res.send("PDF created successfully!");
//   } catch (error) {
//     console.error("Error creating PDF:", error);
//     res.status(500).send("Failed to create PDF");
//   }
// };

// export const fetchMetricPDF = async (req: Request, res: Response) => {
//   const fs = require("fs");
//   if (fs.existsSync(metricPdfPath)) {
//     res.sendFile(metricPdfPath);
//   } else {
//     console.error("PDF file not found at:", metricPdfPath);
//     res.status(404).send("PDF file not found");
//   }
// };

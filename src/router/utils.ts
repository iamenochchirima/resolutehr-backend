import { createMetricPdf, createPdf, fetchMetricPDF, fetchPDF } from "../controllers/utils";
import { Router } from "express";

export default (router: Router) => {
  router.post("/create-pdf", createPdf );
  router.get("/fetch-pdf", fetchPDF);
  router.post("/create-metric-pdf", createMetricPdf);
  router.get("/fetch-metric-pdf", fetchMetricPDF);
};

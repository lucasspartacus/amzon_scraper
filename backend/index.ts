// backend/index.ts
import express from "express";
import cors from "cors";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ API is working");
});

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword parameter" });
  }

  try {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const productNodes = document.querySelectorAll('[data-component-type="s-search-result"]');
    const products = [];

    for (const product of productNodes) {
        console.log(product.innerHTML);
     const titleElement = product.querySelector("h2 a") || product.querySelector(".a-text-normal");
      const ratingElement = product.querySelector(".a-icon-alt");
      const reviewCountElement = product.querySelector(".a-size-base.s-underline-text");
      const imageElement = product.querySelector("img.s-image");

      products.push({
        title: titleElement?.textContent?.trim() || "N/A",
        rating: ratingElement?.textContent?.split(" ")[0] || "N/A",
        reviews: reviewCountElement?.textContent?.trim() || "0",
        image: imageElement?.getAttribute("src") || "",
      });
    }

    res.json({ keyword, products });
  } catch (err) {
    console.error("Scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Amazon" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});

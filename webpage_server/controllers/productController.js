const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Metals.live API - ücretsiz, API key gerektirmez
const GOLD_API_URL = "https://api.metals.live/v1/spot/gold";

console.log("GOLD_API_URL:", GOLD_API_URL);

const getGoldPricePerGram = async () => {
  try {
    const res = await axios.get(GOLD_API_URL);
    // Metals.live response: { price: 2045.67, currency: "USD", unit: "oz" }
    return res.data.price / 31.1035; // Ons'tan gram'a çevir
  } catch (error) {
    console.error("Altın fiyatı alınamadı, varsayılan fiyat kullanılıyor:", error);
    return 65; // Fallback fiyat - yaklaşık $65/gram
  }
};

const readProducts = () => {
  const filePath = path.join(__dirname, "..", "products.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
};

const enrichProducts = (products, goldPrice) => {
  return products.map(p => {
    const price = (p.popularityScore + 1) * p.weight * goldPrice;
    return {
      ...p,
      priceUSD: parseFloat(price.toFixed(2))
    };
  });
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = readProducts();
    const goldPrice = await getGoldPricePerGram();
    const enriched = enrichProducts(products, goldPrice);
    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts
};
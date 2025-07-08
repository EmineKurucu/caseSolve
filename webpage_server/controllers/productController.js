const fs = require("fs");
const path = require("path");
const axios = require("axios");


const GOLD_API_URL = "https://api.metals.live/v1/spot/gold";

console.log("GOLD_API_URL:", GOLD_API_URL);

const getGoldPricePerGram = async () => {
  try {
    const res = await axios.get(GOLD_API_URL);
    
    return res.data.price / 31.1035; // Ons'tan gram'a çevir
  } catch (error) {
    console.error("Altın fiyatı alınamadı, varsayılan fiyat kullanılıyor:", error);
    return 65; 
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
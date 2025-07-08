const express = require("express");
const cors = require("cors"); // ✅ CORS eklendi
const app = express();
const productRoutes = require("./routes/productRoutes");


app.use(cors()); // ✅ CORS aktif edildi
app.use(express.json());
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

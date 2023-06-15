const db = require("../config/db");

module.exports = productService = {
  getAll: async () => {
    const products = await db("products");
    return products;
  },
  getById: async (id) => {
    const prod = await db("products").where("id", id);
    return prod;
  },
  create: async (prod) => {
    const products = await db("products").insert(prod);
    return products;
  },
  update: async (id, prod) => {
    const products = await db("products").where("id", id).update({
      name: prod.name,
      price: prod.price,
      rating: prod.rating,
      images: prod.images,
      colors: prod.colors,
      description: prod.description,
      details: prod.details,
    });
    return products;
  },
  delete: async (id) => {
    const products = await db("products").where("id", id).del();
    return products;
  },
};

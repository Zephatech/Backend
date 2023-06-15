const prodService = require("../service/productService");
module.exports = userController = {
  getAll: async (req, res, next) => {
    try {
      const prods = await prodService.getAll();
      res.json(jpsons);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const prod = await prodService.getById(req.params.id);
      res.json(prod);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const prod = await prodService.create(req.body);
      res.json(prod);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const prod = await prodService.update(req.params.id, req.body);
      res.json(prod);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const prod = await prodService.delete(req.params.id);
      res.json(prod);
    } catch (error) {
      next(error);
    }
  },
};

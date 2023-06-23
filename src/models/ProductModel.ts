import { Product } from "../entity/Product";
import myDataSource from "../config/dataSource";

class ProductModel {
  private static productRepository = myDataSource.getRepository(Product)

  static async findAll() {
    return await this.productRepository.find()
  }

  static async findById(id) {
    return await this.productRepository.findOneBy({ id: id })
  }

  static async findByUserId(userId) {
    return await this.productRepository.findOneBy({ ownerId: userId })
  }

  static async create(ownerId, name, price, description, category, image) {
    const product = new Product();
    product.ownerId = ownerId;
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.image = image;

    await this.productRepository.save(product)
  }

  static async update(id, name, price, description, category, image) {
    const product = await this.productRepository.findOneBy({ id: id })
    if (name) {
      product.name = name;
    }

    if (price) {
      product.price = price;
    }

    if (description) {
      product.description = description;
    }

    if (category) {
      product.category = category;
    }

    if (image) {
      product.image = image;
    }

    await this.productRepository.save(product)
  }

  static async delete(id) {
    const product = await this.productRepository.findOneBy({ id: id })
    await this.productRepository.remove(product)
  }

  static async deleteAll() {
    const products = await this.productRepository.find()
    await this.productRepository.remove(products)
  }

  static async deleteAllByUserId(userId) {
    const products = await this.productRepository.findOneBy({ ownerId: userId })
    await this.productRepository.remove(products)
  }
}

export default ProductModel;
import { Product } from '../entity/Product'
import myDataSource from '../config/dataSource'

class ProductModel {
  private static productRepository = myDataSource.getRepository(Product)

  static async findAll() {
    return await this.productRepository.find()
  }

  static async findAllByKeyword(keyword) {
    return await await this.productRepository
      .createQueryBuilder('product')
      .where('product.isSold = :isSold', { isSold: false })
      .andWhere('product.locked = :locked', { locked: false })
      .andWhere(
        '(product.name ILIKE :searchQuery OR product.description ILIKE :searchQuery)',
        { searchQuery: `%${keyword}%` }
      ).getMany()
  }

  static async findById(id) {
    return await this.productRepository.findOneBy({ id: id })
  }

  static async findByUserId(userId) {
    return await this.productRepository.findBy({ ownerId: userId })
  }

  static async create(ownerId, name, price, description, category, image, options) {
    const product = new Product()
    product.ownerId = ownerId
    product.name = name
    product.price = price
    product.description = description
    product.category = category
    product.image = image
    product.options = options

    return await this.productRepository.save(product)
  }

  static async update(id, name, price, description, category, image) {
    const product = await this.productRepository.findOneBy({ id: id })

    const updatedFields = {
      name: name || product.name,
      price: price || product.price,
      description: description || product.description,
      category: category || product.category,
      image: image || product.image,
    }

    return await this.productRepository.save({
      ...product,
      ...updatedFields,
    })
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
    const products = await this.productRepository.findOneBy({
      ownerId: userId,
    })
    await this.productRepository.remove(products)
  }
}

export default ProductModel

import { Trade } from "../entity/Trade";
import myDataSource from "../config/dataSource";
import { User } from "../entity/User";
import { Product } from "../entity/Product";
import { FindManyOptions } from "typeorm";

class UserModel {
  private static tradeRepository = myDataSource.getRepository(Trade)

  static async findById(id) {
    const options = { where: {id: id}, relations: ['buyer', 'seller', 'product'] }
    return await this.tradeRepository.findOne(options)
  }
  
  static async create(buyer: User, seller: User, product: Product) {
    const trade = new Trade();
    trade.buyer = buyer;
    trade.seller = seller;
    trade.product = product;

    return await this.tradeRepository.save(trade)
  }

  static async findByBuyerId(buyerId) {
    const options = { buyerId: buyerId , relations: ['product'] }
    return await this.tradeRepository.find(options)
  }

  static async findBySellerId(sellerId) {
    const options = { sellerId: sellerId, relations: ['product'] }
    return await this.tradeRepository.find(options)
  }

  static async findByBuyerSellerProductId(buyerId: number, sellerId: number, productId: number) {
    const options: FindManyOptions<Trade> = {
      where: {
        buyer: { id: buyerId },
        seller: { id: sellerId },
        product: { id: productId }
      }
    };
    return await this.tradeRepository.find(options);
  }
}

export default UserModel;
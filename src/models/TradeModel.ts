import { Trade } from "../entity/Trade";
import myDataSource from "../config/dataSource";
import { User } from "../entity/User";
import { Product } from "../entity/Product";

class UserModel {
  private static tradeRepository = myDataSource.getRepository(Trade)

  static async findById(id: number | string) {
    return await this.tradeRepository.findOneBy({ id: id })
  }
  

  static async create(buyer: User, seller: User, product: Product) {
    const trade = new Trade();
    trade.buyer = buyer;
    trade.seller = seller;
    trade.product = product;

    return await this.tradeRepository.save(trade)
  }
}

export default UserModel;
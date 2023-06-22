import { User } from "../entity/User";
import myDataSource from "../config/dataSource";

class UserModel {
  private static userRepository = myDataSource.getRepository(User)

  static async findByEmail(email) {
    return await this.userRepository.findOneBy({ email: email })
  }

  static async create(firstName, lastName, email, password, token, isVerified) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.token = token;
    user.verified = isVerified;

    await this.userRepository.save(user)
  }

  static async verify(email) {
    const user = await this.userRepository.findOneBy({ email: email })
    user.verified = true;
    await this.userRepository.save(user)
  }
}

export default UserModel;
import { User } from '../entity/User'
import myDataSource from '../config/dataSource'

class UserModel {
  private static userRepository = myDataSource.getRepository(User)

  static async findById(id) {
    return await this.userRepository.findOneBy({ id: id })
  }

  static async findByEmail(email) {
    return await this.userRepository.findOneBy({ email: email })
  }

  static async markEmailAsVerified(email) {
    const user = await this.userRepository.findOneBy({ email: email })
    user.verified = true
    user.verificationCode = null
    await this.userRepository.save(user)
  }

  static async create(
    firstName,
    lastName,
    email,
    password,
    isVerified,
    verificationCode
  ) {
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.password = password
    user.verified = isVerified
    user.verificationCode = verificationCode

    await this.userRepository.save(user)
  }

  static async verify(email) {
    const user = await this.userRepository.findOneBy({ email: email })
    user.verified = true
    await this.userRepository.save(user)
  }

  static async updateverificationCode(email, verificationCode) {
    const user = await this.userRepository.findOneBy({ email: email })
    user.verificationCode = verificationCode
    await this.userRepository.save(user)
  }

  static async updatePassword(email, password) {
    const user = await this.userRepository.findOneBy({ email: email })
    user.password = password
    await this.userRepository.save(user)
  }

  static async updateUser(
    userId,
    firstName,
    lastName,
    phoneNumber,
    facebookProfile,
    twitterProfile
  ) {
    const user = await this.userRepository.findOneBy({ id: userId })

    const updatedFields = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phoneNumber: phoneNumber || user.phoneNumber,
      facebookProfile: facebookProfile || user.facebookProfile,
      twitterProfile: twitterProfile || user.twitterProfile,
    }

    await this.userRepository.save({ ...user, ...updatedFields })
  }
}

export default UserModel

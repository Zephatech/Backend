import { Request } from 'express'

interface User {
  userId: number
  email: string
}

interface AuthenticatedRequest extends Request {
  user: User
}

interface PostItemRequest extends AuthenticatedRequest {
  uuid: any
  file: any
}

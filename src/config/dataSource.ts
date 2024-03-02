import { DataSource } from 'typeorm'

const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/entity/*.ts'],
  logging: true,
  synchronize: true,
})

export default myDataSource

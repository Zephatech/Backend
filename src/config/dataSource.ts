import { DataSource } from 'typeorm'

const myDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/entity/*.ts'],
  logging: true,
  synchronize: true,
})

export default myDataSource

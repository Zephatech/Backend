import { DataSource, DataSourceOptions } from 'typeorm'
import * as PostgressConnectionStringParser from 'pg-connection-string'

let config: DataSourceOptions

if (process.env.DATABASE_URL) {
  const connectionOptions = PostgressConnectionStringParser.parse(
    process.env.DATABASE_URL
  )
  config = {
    type: 'postgres',
    host: connectionOptions.host,
    port: Number(connectionOptions.port),
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: ['src/entity/*.ts'],
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    synchronize: true,
  }
} else {
  config = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['src/entity/*.ts'],
    logging: true,
    synchronize: true,
  }
}

const myDataSource: DataSource = new DataSource(config)

export default myDataSource

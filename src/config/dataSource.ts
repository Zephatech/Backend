import { DataSource } from "typeorm"

const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "test",
    database: "UWTRADE",
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})

export default myDataSource
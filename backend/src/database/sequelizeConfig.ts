import { Sequelize } from 'sequelize';

const {
    SCHEMA_NAME = 'stoicron',
    USERNAME = 'admin',
    PASSWORD = 'admin',
    HOST = 'localhost'
} = process.env;

const sequelize: Sequelize = new Sequelize(SCHEMA_NAME, USERNAME, PASSWORD, {
    host: HOST,
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

export default sequelize;
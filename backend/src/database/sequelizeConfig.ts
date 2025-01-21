import { Sequelize } from 'sequelize';

const {
    SCHEMA_NAME_USERDB = 'stoicron',
    USERNAME_USERDB = 'admin',
    PASSWORD_USERDB = 'admin',
    HOST_USERDB = 'localhost',
    PORT_USERDB = 5001
} = process.env;

const sequelize: Sequelize = new Sequelize(SCHEMA_NAME_USERDB, USERNAME_USERDB, PASSWORD_USERDB, {
    host: HOST_USERDB,
    dialect: 'postgres',
    port: Number(PORT_USERDB),
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

export default sequelize;
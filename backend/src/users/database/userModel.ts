import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database/sequelizeConfig';

class UserModel extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public name!: string;
    public username!: string;
    public birthdate!: Date;
    public country!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public active!: boolean;
    public alternative_email!: string;
    public user_provider!: string;
    public role!: string;
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    alternative_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_provider: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true
});

export default UserModel;
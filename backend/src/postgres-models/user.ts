import { DataTypes, Model } from "sequelize";

import sequelize from "../db";
import bcrypt from "bcrypt";

// For Security
const saltRounds: number = 10;

class User extends Model {
    // https://stackoverflow.com/questions/27972271/sequelize-dont-return-password
    toJSON(): Object {
        let values = Object.assign({}, this.get());
        delete values.userPassword;
        return values;
    }
    isPasswordValid(inputPassword: string): boolean {
        return bcrypt.compareSync(
            inputPassword,
            this.getDataValue("userPassword"),
        );
    }
}

User.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userOAuthToken: {
            type: DataTypes.STRING,
        },
        userOAuthProvider: {
            type: DataTypes.STRING,
        },
        userPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            // Getter and Setter https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/
            // get() {
            //     const rawValue = this.getDataValue("userPassword");
            //     return rawValue ? rawValue.toUpperCase() : null;
            // },
            set(value: string) {
                // Storing passwords in plaintext in the database is terrible.
                // Hashing the value with an appropriate cryptographic hash function is better.
                const hashedPassword = bcrypt.hashSync(value, saltRounds);
                this.setDataValue("userPassword", hashedPassword);
            },
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userFamilyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userGivenName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userPhoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userProfilePicture: {
            type: DataTypes.BLOB("long"),
            allowNull: true,
        },
        userProfilePictureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userGender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userBirthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        userCurrency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userPermission: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        schema: "user_management",
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: true,
    },
);
// https://stackoverflow.com/questions/34258938/sequelize-classmethods-vs-instancemethods

export default User;

const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const { SetModel } = require("./Set");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    username: { type: DataTypes.STRING, allowNull: false, field: "username" },
    profilePicURL: { type: DataTypes.STRING, field: "profile_pic_url" },
  },
  {
    tableName: "users", // Map to the existing "users" table
    timestamps: false, // Disable automatic timestamps
  }
);

const Genre = sequelize.define(
  "genres",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
      field: "name",
    },
  },
  {
    tableName: "genres", // Map to the existing "genres" table
    timestamps: false, // Disable automatic timestamps
  }
);

// Define the join table explicitly
const UserGenre = sequelize.define(
  "user_genres",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    genreName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "genre_name",
    },
  },
  {
    tableName: "user_genres", // Map to the existing "user_genres" table
    timestamps: false, // Disable automatic timestamps
  }
);

Genre.belongsToMany(User, {
  through: UserGenre, // Use the explicitly defined join table
  foreignKey: "genre_name", // Foreign key in the join table for Genre
});

User.belongsToMany(Genre, {
  through: UserGenre, // Use the explicitly defined join table
  foreignKey: "user_id", // Foreign key in the join table for User
});

User.hasMany(SetModel, {
  foreignKey: "user_id", // Foreign key in the SetModel table
  as: "sets", // Alias for the association
});

SetModel.belongsTo(User, {
  foreignKey: "user_id", // Foreign key in the SetModel table
  as: "user", // Alias for the association
});

module.exports = { User, Genre, UserGenre, SetModel };

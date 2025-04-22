const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const { User } = require("./User");
const { Track } = require("./Set");

const Like = sequelize.define(
  "likes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" }, // Foreign key
    trackId: { type: DataTypes.INTEGER, allowNull: false, field: "track_id" }, // Foreign key
  },
  {
    tableName: "likes", // Map to the existing "likes" table
    timestamps: false, // Disable automatic timestamps
  }
);

Like.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
Like.belongsTo(Track, { foreignKey: "track_id", targetKey: "id" });

module.exports = Like;

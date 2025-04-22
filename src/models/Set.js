const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const SetModel = sequelize.define(
  "sets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    name: { type: DataTypes.STRING, allowNull: false, field: "name" },
    link: { type: DataTypes.STRING, field: "link" },
    dummy: { type: DataTypes.BOOLEAN, defaultValue: false, field: "dummy" },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
  },
  {
    tableName: "sets",
    timestamps: false,
  }
);

const Track = sequelize.define(
  "tracks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    name: { type: DataTypes.STRING, allowNull: false, field: "name" },
    artist: { type: DataTypes.STRING, allowNull: false, field: "artist" },
    uri: { type: DataTypes.STRING, allowNull: false, field: "uri" },
    imgURL: { type: DataTypes.STRING, field: "img_url" },
  },
  {
    tableName: "tracks",
    timestamps: false,
  }
);

// Define the join table explicitly
const SetTrack = sequelize.define(
  "set_tracks",
  {
    setId: { type: DataTypes.INTEGER, allowNull: false, field: "set_id" },
    trackId: { type: DataTypes.INTEGER, allowNull: false, field: "track_id" },
  },
  {
    tableName: "set_tracks",
    timestamps: false,
  }
);

SetModel.belongsToMany(Track, {
  through: SetTrack,
  foreignKey: "set_id",
});

Track.belongsToMany(SetModel, {
  through: SetTrack,
  foreignKey: "track_id",
});

module.exports = { SetModel, Track };

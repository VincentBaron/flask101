const { Op } = require("sequelize");
const { SetModel, Track } = require("../models/Set"); // Import Set from the index.js file
const { User, Genre, UserGenre } = require("../models/User");
const Like = require("../models/Like");
const sequelize = require("../db/sequelize");

const getSets = async (user) => {
  const now = new Date();
  const offset = (now.getDay() === 1 ? 0 : 7) - now.getDay();
  const lastMonday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - offset,
    1,
    0,
    0
  );

  // Fetch the current user with their genres
  const currentUser = await User.findByPk(user.userId, {
    include: {
      model: Genre,
      as: "genres", // Use the alias defined in the association
    },
  });
  console.log(
    "currentUsergenres: ",
    currentUser.genres.map((genre) => genre.name)
  );

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Create a Set of genre names for the current user
  const currentUserGenres = currentUser.genres.map((genre) => genre.name);

  // Fetch all users with their genres
  const users = await User.findAll({
    include: Genre,
  });

  // Calculate matching percentages for each user
  const userMatches = users.map((u) => {
    const matchingGenres = u.genres
      .map((genre) => genre.name)
      .filter((genre) => currentUserGenres.includes(genre)).length;
    const totalGenres = currentUserGenres.size;
    const matchingPercent = totalGenres > 0 ? matchingGenres / totalGenres : 0;

    return { user: u, matchingPercent };
  });

  // Sort users by matching percentage
  userMatches.sort((a, b) => b.matchingPercent - a.matchingPercent);

  // Get the IDs of the filtered users
  const filteredUserIds = userMatches.map((match) => match.user.id);

  // Fetch sets for the filtered users
  const sets = await SetModel.findAll({
    where: { userId: { [Op.in]: filteredUserIds } },
    include: [
      {
        model: Track, // Include the Track model
        as: "tracks", // Use the alias defined in the association
      },
      {
        model: User, // Include the User model
        as: "user", // Use the alias defined in the association
      },
    ],
  });

  // Filter sets based on creation date and dummy flag
  const filteredSets = sets.filter(
    (set) => set.createdAt >= lastMonday && !set.dummy
  );
  const dummySets = sets.filter((set) => set.dummy);

  // Ensure at least two sets are returned
  if (filteredSets.length < 2) {
    filteredSets.push(...dummySets);
  }

  // Fetch likes for the current user
  const likes = await Like.findAll({ where: { userId: user.userId } });
  const tracksUserLikesMap = new Set(likes.map((like) => like.trackId));

  // Fetch track likes count
  const trackLikes = await Like.findAll({
    where: { createdAt: { [Op.gte]: lastMonday } },
    attributes: ["track_id", [sequelize.fn("COUNT", "track_id"), "count"]],
    group: ["track_id"],
  });

  const trackLikesCountMap = trackLikes.reduce((map, like) => {
    map[like.trackId] = like.dataValues.count;
    return map;
  }, {});

  // Map sets and tracks with like information
  return filteredSets.map((set) => ({
    ...set.toJSON(),
    tracks: set.tracks.map((track) => ({
      ...track.toJSON(),
      liked: tracksUserLikesMap.has(track.id),
      likes: trackLikesCountMap[track.id] || 0,
    })),
  }));
};

module.exports = { getSets };

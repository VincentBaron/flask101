const { getSets } = require("../services/setService");

const resolvers = {
  Query: {
    sets: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      return getSets(user);
    },
  },
};

module.exports = resolvers;

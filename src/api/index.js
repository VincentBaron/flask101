const { ApolloServer } = require("apollo-server-micro");
const typeDefs = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");
const sequelize = require("../db/sequelize");
const authMiddleware = require("../middlewares/authMiddleware");
const { parse } = require("url");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Apply authentication middleware manually
    authMiddleware(req, {}, () => {});
    return { user: req.user }; // Attach the authenticated user to the context
  },
});

const startServer = server.start();

module.exports = async (req, res) => {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL");

  await startServer;

  const parsedUrl = parse(req.url, true);

  if (parsedUrl.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Welcome to the API!");
    return;
  }

  if (parsedUrl.pathname === "/graphql") {
    return server.createHandler({
      path: "/graphql",
    })(req, res);
  }

  res.statusCode = 404;
  res.end("Not Found");
};

export const config = {
  api: {
    bodyParser: false, // Required for Apollo Server
  },
};

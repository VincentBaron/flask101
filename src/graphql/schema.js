const { gql } = require("apollo-server-micro");

const typeDefs = gql`
  type Track {
    id: String!
    name: String!
    artist: String!
    uri: String!
    imgURL: String!
    liked: Boolean
    likes: Int
  }

  type User {
    id: String!
    username: String!
    profilePicURL: String!
  }

  type Set {
    id: String!
    name: String!
    link: String!
    dummy: Boolean!
    user: User!
    tracks: [Track!]!
  }

  type Query {
    sets: [Set!]!
  }
`;

module.exports = typeDefs;

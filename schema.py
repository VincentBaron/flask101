from ariadne import gql

type_defs = gql("""
    type User {
        id: ID!
        username: String!
        profilePicURL: String
        sets: [Set!]
        likes: [Like!]
        genres: [Genre!]
    }

    type Set {
        id: ID!
        name: String!
        link: String
        dummy: Boolean
        createdAt: String!
        user: User!
        tracks: [Track!]
    }

    type Track {
        id: ID!
        name: String!
        artist: String!
        uri: String!
        imgURL: String
        sets: [Set!]
        likes: [Like!]
    }

    type Like {
        id: ID!
        user: User!
        track: Track!
        createdAt: String!
    }

    type Genre {
        name: String!
        users: [User!]
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
        sets: [Set!]!
        set(id: ID!): Set
        tracks: [Track!]!
        track(id: ID!): Track
        genres: [Genre!]!
        likes: [Like!]!
    }

    type Mutation {
        createUser(username: String!, profilePicURL: String): User!
        createSet(name: String!, link: String, dummy: Boolean, userId: ID!): Set!
        addTrackToSet(setId: ID!, trackId: ID!): Set!
        removeTrackFromSet(setId: ID!, trackId: ID!): Set!
        addGenreToUser(userId: ID!, genreName: String!): User!
        removeGenreFromUser(userId: ID!, genreName: String!): User!
        likeTrack(userId: ID!, trackId: ID!): Like!
        unlikeTrack(userId: ID!, trackId: ID!): Boolean!
    }
""") 
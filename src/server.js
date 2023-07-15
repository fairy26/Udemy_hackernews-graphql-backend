import { ApolloServer } from '@apollo/server';

// GraphQLスキーマ定義
const typeDefs = `#graphql
    type Query {
        info: String!
    }
`;

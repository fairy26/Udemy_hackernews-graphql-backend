import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// GraphQLスキーマ定義
const typeDefs = `#graphql
    type Query {
        info: String!
    }
`;

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => 'HackerNewsクローン',
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 ${url}でサーバーを起動中...`);

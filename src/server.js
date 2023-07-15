import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// HackerNewsの各投稿
let links = [
    {
        id: 'link-0',
        description: 'GraphQLチュートリアルをUdemyで学ぶ',
        url: 'www.udemy-graphql-tutorial.com',
    },
];

// GraphQLスキーマ定義
const typeDefs = `#graphql
    type Query {
        info: String!
        feed: [Link!]
    }

    type Link {
        id: ID!
        description: String!
        url: String!
    }
`;

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => 'HackerNewsクローン',
        feed: () => links,
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

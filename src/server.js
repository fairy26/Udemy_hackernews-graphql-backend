import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

// for "ReferenceError: __dirname is not defined in ES module scope"
const __dirname = dirname(new URL(import.meta.url).pathname);

// HackerNewsの各投稿
let links = [
    {
        id: 'link-0',
        description: 'GraphQLチュートリアルをUdemyで学ぶ',
        url: 'www.udemy-graphql-tutorial.com',
    },
];

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => 'HackerNewsクローン',
        feed: () => links,
    },

    Mutation: {
        post: (parent, args) => {
            let idCount = links.length;

            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };

            links.push(link);
            return link;
        },
    },
};

const server = new ApolloServer({
    typeDefs: readFileSync(join(__dirname, 'schema.gql'), 'utf-8'),
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 ${url}でサーバーを起動中...`);

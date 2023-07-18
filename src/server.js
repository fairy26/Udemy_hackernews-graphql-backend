import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

import { PrismaClient } from '@prisma/client';
import { getUserId } from './utls';

const prisma = new PrismaClient();

// for "ReferenceError: __dirname is not defined in ES module scope"
const __dirname = dirname(new URL(import.meta.url).pathname);

// リゾルバ関数
const resolvers = {
    Query: {
        info: () => 'HackerNewsクローン',
        feed: async (parent, args, contextValue) => {
            return contextValue.prisma.link.findMany();
        },
    },

    Mutation: {
        post: (parent, args, contextValue) => {
            const newLink = contextValue.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            });
            return newLink;
        },
    },
};

const server = new ApolloServer({
    typeDefs: readFileSync(join(__dirname, 'schema.gql'), 'utf-8'),
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({
        ...req,
        prisma,
        userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
});

console.log(`🚀 ${url}でサーバーを起動中...`);

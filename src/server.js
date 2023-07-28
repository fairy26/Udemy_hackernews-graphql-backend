import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

import { PrismaClient } from '@prisma/client';
import { getUserId } from './utls.js';

// リゾルバ関係のファイル
import { feed } from './resolvers/Query.js';
import { signup, login, post } from './resolvers/Mutation.js';
import { postedBy } from './resolvers/Link.js';
import { links } from './resolvers/User.js';

// サブスクリプション
import { PubSub } from 'graphql-subscriptions';

const prisma = new PrismaClient();
const pubsub = new PubSub();

// for "ReferenceError: __dirname is not defined in ES module scope"
const __dirname = dirname(new URL(import.meta.url).pathname);

// リゾルバ関数
const resolvers = {
    Query: {
        feed,
    },
    Mutation: {
        post,
        signup,
        login,
    },
    Link: {
        postedBy,
    },
    User: {
        links,
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
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
});

console.log(`🚀 ${url}でサーバーを起動中...`);

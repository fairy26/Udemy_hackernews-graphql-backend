import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { PubSub } from 'graphql-subscriptions'; // サブスクリプション
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { WebSocketServer } from 'ws';

import { getUserId } from './utls.js';

// リゾルバ関係のファイル
import { postedBy } from './resolvers/Link.js';
import { login, post, signup } from './resolvers/Mutation.js';
import { feed } from './resolvers/Query.js';
import { links } from './resolvers/User.js';
// import { newLink } from './resolvers/Subscription.js';

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
});

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
    // Subscription: {
    //     newLink, // FIXME: こっちにしたいけど contextValue.pubsub が解決できない
    // },
    Subscription: {
        newLink: {
            subscribe: () => pubsub.asyncIterator(['NEW_LINK']),
        }, // FIXME: postedBy が null になるためクエリに含められない
    },
    Link: {
        postedBy,
    },
    User: {
        links,
    },
};

const schema = makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, 'schema.gql'), 'utf-8'),
    resolvers,
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        // HTTP server を閉じる
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // WebSocket server を閉じる
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
    introspection: true,
});
await server.start();

app.use(
    '/',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null,
        }),
    })
);

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}/ でサーバーを起動中...`);
});

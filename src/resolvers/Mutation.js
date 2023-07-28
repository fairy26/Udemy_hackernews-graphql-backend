import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utls.js';

// ユーザーの新規登録のリゾルバ
export async function signup(parent, args, contextValue) {
    // パスワードの設定
    const password = await bcrypt.hash(args.password, 10);

    // ユーザーの新規作成
    const user = await contextValue.prisma.user.create({
        data: {
            ...args,
            password,
        },
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// ユーザーのログインのリゾルバ
export async function login(parent, args, contextValue) {
    const user = await contextValue.prisma.user.findUnique({
        where: { email: args.email },
    });
    if (!user) {
        throw new Error('そのようなユーザーは存在しません');
    }

    // パスワードの比較
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('無効なパスワードです');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// ニュースを投稿するリゾルバ
export async function post(parent, args, contextValue) {
    const { userId } = contextValue;

    const newLink = await contextValue.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        },
    });

    contextValue.pubsub.publish('NEW_LINK', { newLink });

    return newLink;
}

import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { APP_SECRET } from '../utls';

// ユーザーの新規登録のリゾルバ
async function signup(parent, args, contextValue) {
    // パスワードの設定
    const password = await hash(args.password, 10);

    // ユーザーの新規作成
    const user = await contextValue.prisma.user.create({
        data: {
            ...args,
            password,
        },
    });

    const token = sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// ユーザーのログインのリゾルバ
async function login(parent, args, contextValue) {
    const user = await contextValue.prisma.user.findUnique({
        where: { email: args.email },
    });
    if (!user) {
        throw new Error('そのようなユーザーは存在しません');
    }

    // パスワードの比較
    const valid = await compare(args.password, user.password);
    if (!valid) {
        throw new Error('無効なパスワードです');
    }

    const token = sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, contextValue) {
    const { userId } = contextValue;

    return await contextValue.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        },
    });
}

module.exports = {
    signup,
    login,
    post,
};

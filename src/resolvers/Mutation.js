import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

APP_SECRET = 'GraphQL';

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

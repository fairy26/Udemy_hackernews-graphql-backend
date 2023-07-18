import { verify } from 'jsonwebtoken';

APP_SECRET = 'GraphQL';

// トークンを復号するための関数
function getTokenPayload(token) {
    // token化される前の情報(user.id)を取得する
    return verify(token, APP_SECRET);
}

// ユーザーIDを取得するための関数
function getUserId(request, authToken) {
    if (request) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new Error('認証ヘッダーが見つかりませんでした');
        }
        const token = authHeader.replace('Bearer', '');
        if (!token) {
            throw new Error('トークンが見つかりませんでした');
        }
        const { userId } = getTokenPayload(token);
        return userId;
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error('認証権限がありません');
}

module.exports = {
    APP_SECRET,
    getUserId,
};

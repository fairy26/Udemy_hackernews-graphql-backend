export function link(parent, args, contextValue) {
    return contextValue.prisma.vote
        .findUnique({
            where: { id: parent.id },
        })
        .link();
}

export function user(parent, args, contextValue) {
    return contextValue.prisma.vote
        .findUnique({
            where: { id: parent.id },
        })
        .user();
}

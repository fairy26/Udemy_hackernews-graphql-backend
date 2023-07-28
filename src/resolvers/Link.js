export function postedBy(parent, args, contextValue) {
    return contextValue.prisma.link
        .findUnique({
            where: { id: parent.id },
        })
        .postedBy();
}

export function votes(parent, args, contextValue) {
    return contextValue.prisma.link
        .findUnique({
            where: { id: parent.id },
        })
        .votes();
}

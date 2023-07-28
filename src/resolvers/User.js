export function links(parent, args, contextValue) {
    return contextValue.prisma.user
        .findUnique({
            where: { id: parent.id },
        })
        .links();
}

export function votes(parent, args, contextValue) {
    return contextValue.prisma.user
        .findUnique({
            where: { id: parent.id },
        })
        .votes();
}

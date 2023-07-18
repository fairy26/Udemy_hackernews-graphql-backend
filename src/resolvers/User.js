function links(parent, args, contextValue) {
    return contextValue.prisma.user
        .findUnique({
            where: { id: parent.id },
        })
        .links();
}

module.exports = {
    links,
};

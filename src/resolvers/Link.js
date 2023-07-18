function postedBy(parent, args, contextValue) {
    return contextValue.prisma.link
        .findUnique({
            where: { id: parent.id },
        })
        .postedBy();
}

module.exports = {
    postedBy,
};

function feed(parent, args, contextValue) {
    return contextValue.prisma.link.findMany();
}

module.exports = {
    feed,
};

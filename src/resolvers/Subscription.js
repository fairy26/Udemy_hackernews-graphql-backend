function newLinkSubscription(parent, args, contextValue) {
    return contextValue.pubsub.asyncIterator(['NEW_LINK']);
}

export const newLink = {
    subscribe: newLinkSubscription,
    resolve: (payload) => {
        return payload;
    },
};

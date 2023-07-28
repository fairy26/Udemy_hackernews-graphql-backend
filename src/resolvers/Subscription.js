function newLinkSubscription(parent, args, contextValue) {
    return contextValue.pubsub.asyncIterator(['NEW_LINK']);
}

export const newLink = {
    subscribe: newLinkSubscription,
    resolve: (payload) => {
        return payload;
    },
};

function newVoteSubscription(parent, args, contextValue) {
    return contextValue.pubsub.asyncIterator(['NEW_VOTE']);
}

export const newVote = {
    subscribe: newVoteSubscription,
    resolve: (payload) => {
        return payload;
    },
};

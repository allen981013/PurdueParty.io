const initState = {
    sellListings: [
        { title: 'Space Jam Poster', price: 0, owner: "Michael Jordan" },
        { title: 'Krabby Patty', price: 0, owner: "Spongebob" },
        { title: 'Heelys', price: 0, owner: "Matt" }
    ]
}

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const marketplaceReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case 'UPDATE_LISTING_SUCCESS':
            console.log("success updating listing");
            return state;
        case 'UPDATE_LISTING_ERR':
            console.log("err updating listing");
            return state;
        case 'DELETE_LISTING_SUCCESS':
            console.log("success deleting listing");
            return state;
        case 'DELETE_LISTING_ERR':
            console.log("err deleting listing");
            return state;
        case 'SAVE_LISTING_SUCCESS':
            console.log('saved listing');
            return state;
        case 'SAVE_LISTING_ERROR':
            console.log('error saving listing');
            return state;
        case 'SAVE_REMOVE_LISTING_SUCCESS':
            console.log('removed saved listing');
            return state;
        case 'SAVE_REMOVE_LISTING_ERROR':
            console.log('error removing saved listing');
            return state;
        case 'CREATE_MESSAGE_SUCCESS':
            console.log("success creating message");
            return state;
        case 'CREATE_MESSAGE_ERR':
            console.log("err creating message");
            return state;
        default:
            return state;
    }
}

export default marketplaceReducer;
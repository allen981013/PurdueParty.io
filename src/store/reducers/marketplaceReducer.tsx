const initState = {
    sellListings: [
        {title: 'Space Jam Poster', price: 5000, owner: "Michael Jordan"},
        {title: 'Krabby Patty', price: 2, owner: "Spongebob"},
        {title: 'Heelys', price: 200, owner: "Matt"}
    ]
}

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const marketplaceReducer = (state=initState, action: Action) => {
    switch (action.type) {
        default :
            return state;
    }
}

export default marketplaceReducer;
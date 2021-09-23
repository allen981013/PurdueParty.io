// Initial state/dummy data, this gets replaced by Firebase info
const initState = {

};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const homepageReducer = (state = initState, action: Action) => {
    switch (action.type) {
        default :
            return state;
    }
}

export default homepageReducer;
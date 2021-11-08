type DiningState = {
    diningErr?: string
}

const initState: DiningState = {
    diningErr: undefined
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const diningReducer = (state=initState, action: Action): DiningState => {
    switch (action.type) {
        case 'SURVEY_SUBMITTED':
            return {
                ...state,
                diningErr: undefined
            }
        case 'SURVEY_ERR':
            return {
                ...state,
                diningErr: "Error during survery submission"
            }
        default :
            return state;
    }
}

export default diningReducer;
import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    posts: [{
        postId: "",
        owner: "",
        classID: "",
        title: "",
        description: "",
        postedDateTime: new Timestamp(0,0),
        upvotes: 1,
        downvotes: 0,
        comments: [""]
    }]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const postReducer = (state=initState, action: Action) => {
    switch (action.type) {
        case 'ADD_POST_SUCCESS':
            console.log('added new post');
            return state;
        case 'ADD_POST_ERR':
            console.log('error adding new post');
            return state;
        default :
            return state;
    }
}

export default postReducer;
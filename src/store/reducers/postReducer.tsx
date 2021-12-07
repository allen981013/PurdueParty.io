import { Timestamp } from '@firebase/firestore';

// Initial state/dummy data, this gets replaced by Firebase info
const initState = {
    posts: [{
        postId: "",
        owner: "",
        classID: "",
        title: "",
        description: "",
        postedDateTime: new Timestamp(0, 0),
        upvotes: 1,
        downvotes: 0,
        comments: [""]
    }]
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const postReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case 'ADD_POST_SUCCESS':
            console.log('added new post');
            return state;
        case 'ADD_POST_ERR':
            console.log('error adding new post');
            return state;
        case 'ADD_COMMENT_SUCCESS':
            console.log('added new comment');
            return state;
        case 'ADD_COMMENT_ERR':
            console.log('error adding new comment');
            return state;
        case 'EDIT_POST_SUCCESS':
            console.log('edited post');
            return state;
        case 'EDIT_POST_ERR':
            console.log('error editing post');
            return state;
        case 'EDIT_COMMENT_SUCCESS':
            console.log('edited comment');
            return state;
        case 'EDIT_COMMENT_ERR':
            console.log('error editing comment');
            return state;
        case 'DELETE_POST_SUCCESS':
            console.log('deleted post');
            return state;
        case 'DELETE_POST_ERR':
            console.log('error deleting post');
            return state;
        case 'UPDATE_VOTECOUNT_SUCCESS':
            console.log('votecount altered successfully');
            return state;
        case 'UPDATE_VOTECOUNT_ERR':
            console.log('error altering votecount');
            return state;
        case 'UPDATE_USERVOTES_SUCCESS':
            console.log('user vote altered successfully');
            return state;
        case 'UPDATE_USERVOTES_ERR':
            console.log('error altering user vote');
            return state;
        case 'DELETE_COMMENT_SUCCESS':
            console.log('deleted comment');
            return state;
        case 'DELETE_COMMENT_ERR':
            console.log('error deleting comment');
            return state;
        case 'ADD_CLASS_SUCCESS':
            console.log('added new class');
            return state;
        case 'ADD_CLASS_ERR':
            console.log('error adding new class');
            return state;
        case 'SAVE_POST_SUCCESS':
            console.log('saved post');
            return state;
        case 'SAVE_POST_ERROR':
            console.log('error saving post');
            return state;
        case 'SAVE_REMOVE_POST_SUCCESS':
            console.log('removed saved post');
            return state;
        case 'SAVE_REMOVE_LISTING_ERROR':
            console.log('error removing saved listing');
            return state;
        default:
            return state;
    }
}

export default postReducer;
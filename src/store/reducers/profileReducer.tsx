
type ProfileState = {
    editStatus?: string
}

const initState: ProfileState = {  // NOTE: We need this type annotation so that the RootState type can be inferred properly. 
    editStatus: undefined,       // Perhaps because initState prop, authError, can assume two types (string and undefined).
};

type Action = {
    type: string,
    payload?: any, // Annotate the payload with proper type, if there are any
}

const profileReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case 'EDIT_PROFILE_SUCCESS':
            console.log('Profile has been edited');
            return {
                ...state,
                editStatus: "Edit profile success"
            }
        case 'EDIT_PROFILE_ERR':
            console.log('Error editing user profile');
            return {
                ...state,
                editStatus: "Edit profile error"
            }
        case 'DELETE_MESSAGE_SUCCESS':
            console.log('Message has been deleted');
            return state
        case 'DELETE_MESSAGE_ERR':
            console.log('Error deleting message');
            return state
        case 'LISTING_REPLY_SUCCESS':
            console.log('Listing reply has been sent');
            return state
        case 'LISTING_REPLY_ERR':
            console.log('Error sending listing reply');
            return state
        default:
            return state;
    }
}

export default profileReducer;
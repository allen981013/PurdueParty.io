import { createSlice } from '@reduxjs/toolkit'
import { assert } from 'console'
import { Action, Dispatch } from 'redux'

// type for states returned by reducer
export interface NavBarStatesRedux {
    username: string;
}

// initial states
const initState: NavBarStatesRedux= {
    username: "Guest",
}

// create slice
export const navbarSlice = createSlice({
    name: 'navbar',
    initialState: initState,
    reducers: {
        usernameLoaded: (state: NavBarStatesRedux, action) => {
            return {
                ...state,
                username: action.payload.username,
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase("LOGIN_SUCCESSFUL", (state, action) => {
            return state
        })
    }
})


// actions 
export const loadUsername = () => {
    return async (dispatch: Dispatch<Action>, getState: any, { getFirebase, getFirestore }: any) => {
        const db = getFirestore()
        const userId: string | undefined = getFirebase().auth.uid
        var payload: {username: "Guest"}
        // Return if no user is logged in 
        if (!userId) {
            dispatch(navbarSlice.actions.usernameLoaded(payload))
            return
        }
        // Query username from db
        db.collection("users").doc(userId).get()
            .then((doc) => {
                if (!doc.exists()) {
                    console.log("Unexpected error: Could not find logged user.")
                }
                assert(doc.username)
                console.log(doc.username)
                payload.username = doc.username
                dispatch(navbarSlice.actions.usernameLoaded(payload))
            });
    }
}

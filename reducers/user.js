import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {},
}

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        login : (state, action)=>{
            state.value = action.payload
        },
        logout : (state, action)=>{
            state.value = {}
        },
        changePushToken : (state, action)=>{
            state.value.push_token = action.payload
        },
        addBookmark  : (state, action)=>{
            state.value.bookmarks.push(action.payload)
        },
        removeBookmark : (state, action)=>{
            state.value.bookmarks = state.value.bookmarks.filter(e=> e!== action.payload)
        },
        changeUserInfos : (state, action)=>{
            state.value.firstname = action.payload.firstname
            state.value.name = action.payload.name
            state.value.email = action.payload.email
            state.value.phone = action.payload.phone
        },
    }
})

export const { login, changePushToken, logout, addBookmark, removeBookmark, changeUserInfos } = userSlice.actions
export default userSlice.reducer
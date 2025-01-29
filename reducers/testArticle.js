import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : [],
}

export const testArticlesSlice = createSlice({
    name : 'testArticle',
    initialState,
    reducers : {
        addTestArticle : (state, action)=>{
            state.value = []
            state.value.push(action.payload)
            state.value.push(action.payload)
        },
        deleteTestArticle : (state) => {
            state.value = []
        },
    }
})

export const { addTestArticle, deleteTestArticle } = testArticlesSlice.actions
export default testArticlesSlice.reducer
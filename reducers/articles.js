import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : []
}

export const articlesSlice = createSlice({
    name : "articles",
    initialState,
    reducers : {
        fillWithArticles : (state, action)=>{
            state.value = action.payload
        },
        suppressArticles : (state, action)=>{
            state.value = []
        },
        deleteOneArticle : (state, action)=>{
            state.value = state.value.filter(e=> e._id !== action.payload)
        },
        addOneArticle : (state, action)=>{
            state.value.push(action.payload)
        },
        modifyArticle : (state, action)=>{
            state.value = state.value.map(e=>{
                if (e._id == action.payload._id){
                    e = action.payload
                }
                return e
            })
        },
        deleteHomeContent : (state, action)=>{
            state.value = state.value.filter(e=> e.category !== "home")
        }
    }
})

export const { fillWithArticles, suppressArticles, addOneArticle, modifyArticle, deleteHomeContent, deleteOneArticle } = articlesSlice.actions
export default articlesSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {
        request : {},
        emergenciesList : []
    },
}

export const emergenciesSlice = createSlice({
    name : 'emergencies',
    initialState,
    reducers : {
        addRequest : (state, action)=>{
            state.value.request = action.payload
        },
        supressRequest : (state)=>{
            state.value.request = {}
        }
    }
})

export const { addRequest, supressRequest } = emergenciesSlice.actions
export default emergenciesSlice.reducer
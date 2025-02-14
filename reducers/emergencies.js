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
        },
        addEmergencies : (state, action)=>{
            state.value.emergenciesList = action.payload
        }
    }
})

export const { addRequest, supressRequest, addEmergencies } = emergenciesSlice.actions
export default emergenciesSlice.reducer
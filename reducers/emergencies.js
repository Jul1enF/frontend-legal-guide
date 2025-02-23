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
        },
        suppressAnEmergency : (state, action)=>{
            state.value.emergenciesList = state.value.emergenciesList.filter(e => e._id !== action.payload)
        }
    }
})

export const { addRequest, supressRequest, addEmergencies, suppressAnEmergency } = emergenciesSlice.actions
export default emergenciesSlice.reducer
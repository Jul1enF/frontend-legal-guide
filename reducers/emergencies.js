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
            Object.assign(state.value.request, action.payload)
        },
        supressRequest : (state)=>{
            state.value.request = {}
        },
        addEmergencies : (state, action)=>{
            state.value.emergenciesList = action.payload
        },
        suppressAnEmergency : (state, action)=>{
            state.value.emergenciesList = state.value.emergenciesList.filter(e => e._id !== action.payload)
        },
        toggleBackgroundLocation : (state, action )=>{
            state.value.request.backgroundLocation = action.payload
        },
        toggleUserLocationPermission : (state, action )=>{
            state.value.request.userLocationPermission = action.payload
        },
    }
})

export const { addRequest, supressRequest, addEmergencies, suppressAnEmergency, toggleBackgroundLocation, toggleUserLocationPermission } = emergenciesSlice.actions
export default emergenciesSlice.reducer
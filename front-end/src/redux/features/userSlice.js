import {createSlice} from '@reduxjs/toolkit'

// trạng thái ban đầu của slice
const initialState={
    user:null,
    isAuthenticated:false,
    loading:true
}

export const userSlice=createSlice({
    initialState,
    name:'userSlice',
    reducers:{
        setUser(state,action){
            state.user=action.payload
        },
        setIsAuthenticated(state,action){
            state.isAuthenticated=action.payload
        },
        setLoading(state,action){
            state.loading=action.payload
        },
        logout(state){
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
    }
    }
})

export default userSlice.reducer
export const {setIsAuthenticated,setUser,setLoading,logout}=userSlice.actions
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appAxios } from "../commons/utiles";


const initialState = {
    sotre: []
}

export const getStores = createAsyncThunk('storeSlice/getStores', async() =>{

    // console.log('called')
    const store = await appAxios.get('/store-list')
    .then(resp =>{

        return resp.data.store
    }).catch((error) =>{ console.log(error)})

    return store

})
export const storeSlice = createSlice({
    name: "storeSlice",
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder.addCase(getStores.pending,(state, {payload}) =>{
            console.log("getstore is pending");

        })

        builder.addCase(getStores.fulfilled,(state, {payload}) =>{
            state.sotre = payload;
            console.log(payload);
            
        })

        builder.addCase(getStores.rejected,(state, {payload}) =>{
            console.log("getstore is rejected");
            
        })
    }
})
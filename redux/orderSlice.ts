import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appAxios } from "../commons/utiles";
import { Iorder } from "../commons/shema";


const initialState = {
    orders:[],
    accessdata:{}
};

export const  getAllOrders = createAsyncThunk('orderSlice/getAllOrders', async () =>{
    
    console.log('called')
    const orders = await appAxios.get('order/cust-list')
    .then(resp =>{
        console.log(resp.data.accessdata);
        
        return resp.data
    }).catch((error) =>{ console.log(error)})

    return orders
})

export const ordersLice = createSlice({
    name: "orderSlice",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {

        builder.addCase(getAllOrders.pending, (state, {payload}) =>{

            console.log('client  retrieving is pended');
        })

        builder.addCase(getAllOrders.fulfilled, (state, {payload}) =>{

           state.orders = payload.orderlist;
           state.accessdata = payload.accessdata;

        })

        builder.addCase(getAllOrders.rejected, (state, {payload}) =>{

            console.log('getAllOrders is rejected');
        })
           
         
        
    }
   
})
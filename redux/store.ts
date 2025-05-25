import { configureStore} from "@reduxjs/toolkit";
import { ordersLice } from "./orderSlice";
import { authenfication } from "./auth";
import { storeSlice } from "./storeSlice";

export const store = configureStore({
    reducer:{
        auth: authenfication.reducer,
         orders: ordersLice.reducer,
         stores: storeSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPhoneInfo {
  id: string;
  code: string;
  numero: string;
  site: string;
}
interface AuthState {
    isLogged: boolean;
    phoneInfo: IPhoneInfo | null ,
    data: [];
}

const  initialState: AuthState = {
    isLogged: false,
    phoneInfo: null,
    data: [],
}

export const authenfication = createSlice({
    name: "authenfication",
    initialState,
    reducers:{
        alterAuth: (state, {payload}: PayloadAction<boolean>) =>{
            state.isLogged = payload
        },
        setphoneInfo: (state, {payload}: PayloadAction<IPhoneInfo>) =>{
            state.phoneInfo = payload
        },
        setData: (state, {payload}: PayloadAction<[]>) =>{
            state.data = payload
        }
    }
})

export const {alterAuth, setphoneInfo, setData} = authenfication.actions;
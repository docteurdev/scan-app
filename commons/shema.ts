import React from "react";
import { TextInputProps } from "react-native";

export type RootStackParamList = {
  home: undefined;
  scanner: undefined,
  register: undefined,
  sync: undefined
};

export interface ILogin {
  value: string,
  placeholder: string,
  icon: React.ReactNode,
  secureTextEntry?: boolean,
  textContentType?: string,
  eye?: React.ReactNode,
  props: TextInputProps
  onChangeText: () => void
}

export interface IuserInfo {
  id: number,
  name: string,
  number: string,
  email: string,
  address: string,
  taxnumber: number,
  username: string,
  password: number,
  store_ID: number,
  reffstore: number,
  approved: number,
  delet_flage: number
}

export interface IbtnLogin {
  text: string,
  action: () => void
}

export interface IHomeHeaderItem {
  text: string,
  icon: React.ReactNode,
  length: number
}

export interface IPage {
  navigation: undefined
}



export interface Iorder {
  id: number,
  order_id: string,
  order_date: string,
  delivery_date: string,
  order_status: number,
  service_list: string,
  customer_id: string,
  store_id: string,
  created_by: string,
  addon_data: string,
  addon_price: number,
  sub_total: number,
  tax: number,
  coupon_id: string,
  coupon_discount: number,
  extra_discount: number,
  gross_total: number,
  paid_amount: number,
  balance_amount: number,
  payment_data: string,
  tax_amount: number,
  note: string,
  stutus_change_date: string,
  master_comission: number,
  name: string,
  number: string,
  storeName: string,
  orderStatus: string,
  navigation?: any
}

export interface IorderDetail {
  id: number,
  service_color: string,
  service_id: string,
  service_img: string,
  service_name: string,
  service_quntity: number,
  service_type_id: string,
  service_type_name: string,
  service_type_price: number
}

export interface Ipayment {
  ac_name: string,
  id: number,
  order_id: string,
  payment_account: string,
  payment_amount: number,
  payment_date: string
}

export interface svceSuppl {
  addon: string
  id: number,
  price: number,
  status: string,
  store_ID: string
}


export interface IorderPaiment {
  addon_data: string,
  addon_price: number,
  balance_amount: number,
  coupon_discount: number,
  coupon_id: string,
  created_by: string,
  customer_id: string,
  delivery_date: string,
  extra_discount: number,
  gross_total: number,
  id: number,
  master_comission: number,
  note: string
  order_date: string,
  order_id: string,
  order_status: number,
  paid_amount: number,
  payment_data: string,
  status: string,
  store_id: string,
  stutus_change_date: "2023-07-20T11:05:40.000Z",
  sub_total: number,
  tax: number,
  tax_amount: number
}

export interface ImasterStore {
  address: string,
  admin_id: string,
  city: string,
  country: string,
  createdat: "2023-06-20T11:59:34.000Z",
  delete_flage: string,
  district: string,
  id: number,
  logo: "1687262374795-tissu.png",
  mobile_number: string,
  name: string,
  password: string,
  roll_ID:  string,
  shop_commission: number,
  state: string,
  status:  string,
  store_email: "mas@mail.com",
  store_tax_number: string,
  tax_percent: number,
  username: string
  zipcode: string
}


export interface IStore{
  id: number,
  name: string,
}

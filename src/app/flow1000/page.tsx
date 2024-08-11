'use client'
import { Provider } from 'react-redux'
import store from "../../store"
export default function Flow1000() {
  return <Provider store={store}>Flow1000 here</Provider>
}
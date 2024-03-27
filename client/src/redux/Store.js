import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from "./user/userSlice"
import adminReducer from './admin/adminSlice';
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'
import socketMiddleware from './socketMiddleware';


const rootReducer = combineReducers({
    user:userReducer,
    admin:adminReducer,
    

})
const persistConfig = {
    key: 'root',
    storage,
    version:1,

}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    })

  export const persistor = persistStore(store)
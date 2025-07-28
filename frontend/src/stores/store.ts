import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import couriersSlice from "./couriers/couriersSlice";
import reportsSlice from "./reports/reportsSlice";
import sellersSlice from "./sellers/sellersSlice";
import shipmentsSlice from "./shipments/shipmentsSlice";
import support_ticketsSlice from "./support_tickets/support_ticketsSlice";
import warehousesSlice from "./warehouses/warehousesSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
couriers: couriersSlice,
reports: reportsSlice,
sellers: sellersSlice,
shipments: shipmentsSlice,
support_tickets: support_ticketsSlice,
warehouses: warehousesSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

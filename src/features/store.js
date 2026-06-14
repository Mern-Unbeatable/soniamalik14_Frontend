import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import eventsReducer from '../features/events/eventsSlice';
import recruitmentReducer from '../features/recruitment/recruitmentSlice';
import serviceReducer from '../features/service/serviceSlice';
import newsReducer from '../features/news/newsSlice';
import usersReducer from './users/usersSlice';
import providerListingReducer from '../features/providerListing/providerListingSlice';
import sportsCategoriesReducer from './sportsCategories/sportsCategoriesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer, // <- key must match useSelector
    events: eventsReducer,
    recruitment: recruitmentReducer,
    service: serviceReducer,
    news: newsReducer,
    users: usersReducer,
    providerListing: providerListingReducer,
    sportsCategories: sportsCategoriesReducer,
  },
});

export default store;

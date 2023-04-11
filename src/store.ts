import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './ImageSlice';
import { useDispatch } from 'react-redux';


export const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the shape of an Image object
export interface Image {
  id: string;
  filename: string;
  url: string;
  sizeInBytes: number;
  uploadedBy: string;
  createdAt: string;
  favorited: boolean;
}

// Define the shape of the state of the Images slice
export interface ImagesState {
  images: Image[];
  loading: boolean;
  error: string | null;
}

// Define the initial state of the Images slice
const initialState: ImagesState = {
  images: [],
  loading: false,
  error: null,
};

// Create an async thunk to fetch images from an API
export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
  const response = await fetch('https://agencyanalytics-api.vercel.app/images.json');
  
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  
  // Get the data as an array of Image objects
  const data: Image[] = await response.json();
  
  // Map over the array and set the 'favorited' property to true if it is equal to true
  return data.map(image => ({ ...image, favorited: image.favorited === true }));
});

// Create an async thunk to delete an image
export const deleteImageAsync = createAsyncThunk('images/deleteImage', async (imageId: string) => {
  return imageId;
});

// Define the Images slice
export const ImageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    // Define a reducer to toggle the 'favorited' property of an Image
    toggleFavorite: (state, action: { payload: string }) => {
      const image = state.images.find((image) => image.id === action.payload);
      if (image) {
        image.favorited = !image.favorited;
      }
    },
  },
  extraReducers: (builder) => {
    // Define how the state should change during the 'fetchImages' async thunk lifecycle
    builder.addCase(fetchImages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.loading = false;
      state.images = action.payload;
    });
    builder.addCase(fetchImages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Failed to fetch images';
    });

    // Define how the state should change during the 'deleteImageAsync' async thunk lifecycle
    builder.addCase(deleteImageAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteImageAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.images = state.images.filter(image => image.id !== action.payload);
    });
    builder.addCase(deleteImageAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Failed to delete image';
    });
  },
});

// Export the 'toggleFavorite' reducer action and the Images slice reducer
export const { toggleFavorite } = ImageSlice.actions;
export default ImageSlice.reducer;

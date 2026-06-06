# News Management API Setup

## Overview

The news management feature has been set up with a Redux-based architecture that can easily switch from local JSON data to a real backend API.

## Files Created

### 1. Data Layer

- **`src/data/newsData.json`** - Local news data (currently in use)

### 2. API Service Layer

- **`src/features/news/newsAPI.js`** - API calls with Redux Thunk
  - `fetchNews()` - Get all news
  - `createNews(data)` - Create new news item
  - `updateNews({id, data})` - Update existing news
  - `deleteNews(id)` - Delete news item

### 3. State Management

- **`src/features/news/newsSlice.js`** - Redux slice for news state
- **`src/features/store.js`** - Updated to include news reducer

### 4. Endpoints Configuration

- **`src/services/httpEndpoint.js`** - Added NEWS endpoints

## Current Setup (Local Data)

Currently, the app uses local JSON data with simulated API delays (500ms). All CRUD operations work in-memory.

## How to Switch to Real Backend API

When your backend is ready, follow these steps:

### Step 1: Update `newsAPI.js`

In `src/features/news/newsAPI.js`, uncomment the real API calls and comment out the local data logic:

```javascript
// Fetch all news
export const fetchNews = createAsyncThunk(
  'news/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      // Uncomment this line:
      return apiExecutor((signal) => GET(ENDPOINT.NEWS.LIST, { signal }), rejectWithValue, signal);

      // Comment out or remove these lines:
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // return newsData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch news');
    }
  }
);
```

Do the same for `createNews`, `updateNews`, and `deleteNews`.

### Step 2: Verify Backend Endpoints

Make sure your backend has these endpoints:

- `GET /api/news` - List all news
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Step 3: Update API Base URL

If needed, update your axios instance configuration in `src/services/axiosInstance.js` with your backend URL.

### Step 4: Test

Run the app and test all CRUD operations to ensure they work with the real backend.

## Redux State Structure

```javascript
{
  news: {
    list: [],      // Array of news items
    loading: false, // Loading state
    success: null,  // Success state
    error: null     // Error message
  }
}
```

## Usage in Components

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, createNews, updateNews, deleteNews } from '../features/news/newsAPI';
import { selectAllNews, selectNewsLoading } from '../features/news/newsSlice';

// In component
const dispatch = useDispatch();
const newsList = useSelector(selectAllNews);
const loading = useSelector(selectNewsLoading);

// Fetch data
useEffect(() => {
  dispatch(fetchNews());
}, [dispatch]);

// Create
await dispatch(createNews({ title, desc, img })).unwrap();

// Update
await dispatch(updateNews({ id, data: { title, desc, img } })).unwrap();

// Delete
await dispatch(deleteNews(id)).unwrap();
```

## Benefits of This Architecture

1. **Easy Migration** - Switch from local to backend with minimal code changes
2. **Centralized State** - All news state managed in Redux
3. **Error Handling** - Consistent error handling via `apiExecutor`
4. **Loading States** - Built-in loading and error states
5. **Scalable** - Easy to add more endpoints and features

## Note

Currently all changes are in-memory only. When you refresh the page, data resets to the original `newsData.json` content. Once connected to a backend, changes will persist.

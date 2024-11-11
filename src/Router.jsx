import { App } from './App.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import HomePage from './Pages/HomePage.jsx';
import DataPage from './Pages/DataPage.jsx';
import { createBrowserRouter } from 'react-router-dom';


export const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
            path:"/stuff",
            element: <DataPage />
        }
      ],
    },
  ]);
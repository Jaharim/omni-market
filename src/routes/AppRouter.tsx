import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/products/:productId/',
        element: <ProductDetail />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);

export default AppRouter;

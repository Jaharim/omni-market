import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';

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
    ],
  },
]);

export default AppRouter;

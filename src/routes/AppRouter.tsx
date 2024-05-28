import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Cart from '../pages/Cart';
import SignUp from '../pages/SignUp';
import SearchedProducts from '../pages/SearchedProducts';
import SellerCenter from '../pages/SellerCenter';
import SellerEditProduct from '../pages/SellerEditProduct';
import OrderPage from '../pages/OrderPage';
import MyPage from '../pages/MyPage';
import ErrorPage from '../pages/ErrorPage';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/products/:productId/',
        element: <ProductDetail />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/cart',
        element: <Cart />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/signup',
        element: <SignUp />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/myPage',
        element: <MyPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/sellerCenter',
        element: <SellerCenter />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/sellerCenter/editProduct',
        element: <SellerEditProduct />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/products',
        element: <SearchedProducts />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/order',
        element: <OrderPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default AppRouter;

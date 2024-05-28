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
        path: 'omni-market/',
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/products/:productId/',
        element: <ProductDetail />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/login',
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/cart',
        element: <Cart />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/signup',
        element: <SignUp />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/myPage',
        element: <MyPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/sellerCenter',
        element: <SellerCenter />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/sellerCenter/editProduct',
        element: <SellerEditProduct />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/products',
        element: <SearchedProducts />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'omni-market/order',
        element: <OrderPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default AppRouter;

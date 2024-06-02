import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Login from '../pages/Auth/Login';
import Cart from '../pages/Cart/Cart';
import SignUp from '../pages/Auth/SignUp';
import SearchedProducts from '../pages/SearchedProducts/SearchedProducts';
import SellerCenter from '../pages/SellerCenter/SellerCenter';
import SellerEditProduct from '../pages/SellerCenter/SellerEditProduct';
import OrderPage from '../pages/OrderPage/OrderPage';
import MyPage from '../pages/MyPage/MyPage';
import ErrorPage from '../pages/Error/ErrorPage';

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

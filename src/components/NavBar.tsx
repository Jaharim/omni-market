import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import shoppingCartIcon from '../assets/icon-shopping-cart.svg';
import clickedShoppingCartIcon from '../assets/icon-clicked-shopping-cart.svg';
import shoppingBagIcon from '../assets/icon-shopping-bag.svg';
import usermenuModal from '../assets/usermenu-modal-icon.svg';
import userIcon from '../assets/icon-user.svg';
import clickedUserIcon from '../assets/icon-clicked-user.svg';
import { useQueryClient } from '@tanstack/react-query';
import { /* useCallback */ useEffect, useState } from 'react';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

export default function NavBar() {
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const location = useLocation();
  const [loginState, setLoginState] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [usermenuState, setUsermenuState] = useState(false);
  //const [token, setToken] = useState('');

  useEffect(() => {
    let loginInfo: LoginInfo = queryClient.getQueryData(['loginInfo']);
    const authInfoString = localStorage.getItem('authInfo');
    if (!loginInfo && authInfoString) {
      const { id, token, loginType } = JSON.parse(authInfoString!);
      queryClient.setQueryData(['loginInfo'], {
        id,
        token,
        loginType,
      });
    }
    if (loginInfo) {
      loginInfo = queryClient.getQueryData(['loginInfo']);
      setLoginType(loginInfo!.loginType);
      setLoginState(true);
    }
    /*  const token = loginInfo!.token;
    if (loginInfo) {
      setToken(token);
    } */
  }, [queryClient]);
  /* 
  const getLoginInfo: () => LoginInfo = useCallback(() => {
    return queryClient.getQueryData(['loginInfo']);
  }, [queryClient]);
 */
  const handleUserLogout = async () => {
    setLoginState(false);
    localStorage.removeItem('authInfo');
    queryClient.removeQueries({ queryKey: ['loginInfo'] });
    return navigation('/omni-market/');
  };

  const handleNavLink = (buttonName: string) => {
    if (buttonName === 'cart') {
      navigation('/omni-market/cart');
    } else if (buttonName === 'user') {
      if (loginState) {
        if (loginType === 'BUYER') setUsermenuState((prev) => !prev);
        else if (loginType === 'SELLER') handleUserLogout();
      } else {
        navigation('/omni-market/login');
      }
    } else if (buttonName === 'sellerCenter') {
      navigation('/omni-market/sellerCenter');
    }
  };

  const linkToMyPage = () => {
    navigation('/omni-market/myPage');
  };
  /* 
  useEffect(() => {
    if (getLoginInfo()) {
      setLoginState(true);
      const loginInfo: LoginInfo = queryClient.getQueryData(['loginInfo']);
      setLoginType(loginInfo!.loginType);
    }
  }, [getLoginInfo, queryClient]); */

  //console.log(loginType);

  return (
    <NavBarContainer>
      {loginType === 'BUYER' && loginState && (
        <NavBarContentsBox
          onClick={() => handleNavLink('cart')}
          $select={location.pathname}
          $clicked={false}
        >
          <img
            src={
              location.pathname === '/omni-market/cart'
                ? clickedShoppingCartIcon
                : shoppingCartIcon
            }
            alt='장바구니아이콘'
          />
          <span className='cartSpan'>장바구니</span>
        </NavBarContentsBox>
      )}
      <NavBarContentsBox
        $select={location.pathname}
        $clicked={usermenuState}
        onClick={() => handleNavLink('user')}
      >
        <img
          src={
            usermenuState || location.pathname === '/omni-market/myPage'
              ? clickedUserIcon
              : userIcon
          }
          alt='유저아이콘'
        />
        {loginState ? (
          loginType === 'BUYER' ? (
            <span>사용자메뉴</span>
          ) : (
            <span>로그아웃</span>
          )
        ) : (
          <span>로그인</span>
        )}
        {usermenuState && loginType === 'BUYER' && (
          <UsermenuModal $backgroundImage={usermenuModal}>
            <span onClick={linkToMyPage}>마이페이지</span>
            <span onClick={handleUserLogout}>로그아웃</span>
          </UsermenuModal>
        )}
        {/* 
        {usermenuState && loginType === 'SELLER' && (
          <UsermenuModal $backgroundImage={usermenuModal}>
            <span onClick={handleUserLogout}>로그아웃</span>
          </UsermenuModal>
        )} */}
      </NavBarContentsBox>
      {loginType === 'SELLER' && loginState && (
        <SellerCenterButton onClick={() => handleNavLink('sellerCenter')}>
          <img src={shoppingBagIcon} alt='쇼핑백아이콘' />
          <span>판매자 센터</span>
        </SellerCenterButton>
      )}
    </NavBarContainer>
  );
}

const UsermenuModal = styled.div<{ $backgroundImage: string }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 130px;
  height: 120px;
  top: 115%;
  gap: 8px;
  padding: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  background-color: white;

  & > span {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: #767676;
    border: 1px solid #fff;
  }
  & > span:hover {
    border: 1px solid black;
    border-radius: 5px;
    font-weight: bold;
    color: black;
  }
  & > span:nth-child(1) {
    //margin-top: 15px;
  }
`;

const SellerCenterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 168px;
  height: 54px;
  margin-left: 5px;
  gap: 8px;
  border: none;
  border-radius: 10px;
  background-color: #21bf48;
  cursor: pointer;

  & > span {
    font-size: 16px;
    color: white;
  }
`;

const NavBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  a {
    text-decoration: none;
  }
`;

const NavBarContentsBox = styled.div<{ $select: string; $clicked: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  img {
    width: 28px;
  }

  & > span {
    font-size: 14px;
    color: ${(props) => (props.$clicked ? '#21bf48' : '#767676')};
  }

  span.cartSpan {
    color: ${(props) =>
      props.$select === ('/omni-market/cart' || '/omni-market/myPage')
        ? '#21bf48'
        : ''};
  }
`;

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shoppingCartIcon from '../assets/icon-shopping-cart.svg';
import myPageIcon from '../assets/icon-user.svg';

export default function NavBar() {
  return (
    <NavBarContainer>
      <Link to='/'>
        <NavBarContentsBox>
          <img src={shoppingCartIcon} alt='장바구니' />
          <span>장바구니</span>
        </NavBarContentsBox>
      </Link>
      <Link to='/'>
        <NavBarContentsBox>
          <img src={myPageIcon} alt='마이페이지' />
          <span>마이페이지</span>
        </NavBarContentsBox>
      </Link>
    </NavBarContainer>
  );
}

const NavBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  a {
    text-decoration: none;
  }
`;

const NavBarContentsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  img {
    width: 28px;
  }

  span {
    font-size: 14px;
    color: #767676;
  }
`;

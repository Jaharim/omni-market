import { Link } from 'react-router-dom';
import headerLogo from '../../assets/omni-header-h1.svg';
import styled from 'styled-components';

export default function SellerCenterHeader() {
  return (
    <HeaderContainer>
      <section className='header-wrapper'>
        <h1 className='a11y-hidden'>판매자센터 헤더</h1>
        <HeaderLeft>
          <Link to='/omni-market/'>
            <img className='header-logo' src={headerLogo} alt='헤더로고' />
          </Link>
          <Link to='/omni-market/sellerCenter'>
            <span>판매자 센터</span>
          </Link>
        </HeaderLeft>
      </section>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  //max-width: 1280px;
  margin: 0 auto;
  padding: 22px 100px;
  //padding-left: 100px;

  .header-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 90px;

    .a11y-hidden {
      clip: rect(1px, 1px, 1px, 1px);
      clip-path: inset(50%);
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
    }
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  .header-logo {
    width: 250px;
  }

  a,
  span {
    font-size: 28px;
    font-weight: bold;
    text-decoration: none;
  }

  a:visited {
    color: #000;
  }
`;

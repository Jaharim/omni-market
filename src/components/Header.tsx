import styled from 'styled-components';
import NavBar from './NavBar';
import headerLogo from '../assets/omni-header-h1.svg';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <HeaderContainer>
      <section className='header-wrapper'>
        <h1 className='a11y-hidden'>옴니마켓헤더</h1>
        <HeaderLeft>
          <Link to='/'>
            <img className='header-logo' src={headerLogo} alt='헤더로고' />
          </Link>
          <SearchBar />
        </HeaderLeft>
        <NavBar />
      </section>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;

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
  gap: 30px;

  .header-logo {
    width: 220px;
  }
`;

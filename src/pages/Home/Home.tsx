import styled from 'styled-components';
import Header from '../../components/Header';
import Products from '../Home/Products';
import ScrollToTopButton from '../../components/ScrollToTopButton';

export default function Home() {
  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <Products />
      <ScrollToTopButton />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

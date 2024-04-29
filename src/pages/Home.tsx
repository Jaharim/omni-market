import styled from 'styled-components';
import Header from '../components/Header';
import Products from '../components/Products';

export default function Home() {
  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <Products />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

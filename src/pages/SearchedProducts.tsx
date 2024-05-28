import styled from 'styled-components';
import Header from '../components/Header';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SearchResults from '../components/SearchResults';

export default function SearchedProducts() {
  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <SearchResults />
      <ScrollToTopButton />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

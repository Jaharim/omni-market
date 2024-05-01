import styled from 'styled-components';
import searchIcon from '../assets/search.svg';

export default function SearchBar() {
  return (
    <SearchForm>
      <input type='text' placeholder='상품의 이름을 검색하세요' />
      <button type='button'>
        <img src={searchIcon} alt='상품검색버튼' />
      </button>
    </SearchForm>
  );
}

const SearchForm = styled.form`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: row;
  input {
    display: block;
    box-sizing: border-box;
    width: 400px;
    height: 46px;
    padding-left: 20px;
    border-style: solid;
    border-radius: 50px;
    border-color: #21bf48;
    outline: none;
    font-size: 16px;

    &:active,
    &:hover,
    &:focus {
      border-color: #81dfa0;
    }
  }

  button {
    position: absolute;
    right: 10px;
    cursor: pointer;
    background-color: unset;
    outline: none;
    border-style: none;
  }
`;

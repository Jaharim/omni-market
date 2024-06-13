import styled from 'styled-components';
import searchIcon from '../assets/search.svg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const navigation = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const searchedInput = watch('searchedInput');

  /* const searchProductsMutation = useMutation({
    mutationFn: () => searchProducts(searchedInput),
    onSuccess: (data) => {
      //console.log(data);
    },
    onError: (err) => {
      //console.log(err);
    },
  }); */

  const onSubmit = () => {
    //console.log(searchedInput);
    navigation(`/omni-market/products/?search=${searchedInput}`);
    //searchProductsMutation.mutate();
  };

  return (
    <SearchForm onSubmit={handleSubmit(onSubmit)}>
      <input
        type='text'
        placeholder='상품의 이름을 검색하세요'
        {...register('searchedInput')}
      />
      <button type='submit'>
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
      border-color: #21bf48;
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

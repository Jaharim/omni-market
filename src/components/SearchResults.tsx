import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../apis/api';

interface SearchResultsObject {
  product_id: number;
  image: string;
  product_info: string;
  store_name: string;
  product_name: string;
  price: number;
}

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchedInput = queryParams.get('search');

  //console.log(location, queryParams, searchedInput);
  /* `"${searchedInput}" 총 ${data.count}건의 검색 결과가 있습니다.` */
  const navigation = useNavigate();

  const { data } = useQuery({
    queryKey: ['products', searchedInput],
    queryFn: () => searchProducts(searchedInput),
  });

  const linkToDetailPage = (productId: number) => {
    navigation(`${productId}`);
  };

  //console.log(data);

  return (
    <SearchResultsContainer>
      <span>
        <strong>"{searchedInput}"</strong> 총{' '}
        <strong>{data ? data.count : ''}</strong>건의 검색 결과가 있습니다.
      </span>
      <SearchResultsGrid>
        <ul>
          {data &&
            data.results.map((el: SearchResultsObject) => {
              return (
                <li
                  key={el.product_id}
                  onClick={() => linkToDetailPage(el.product_id)}
                >
                  <img src={el.image} alt={el.product_info} />
                  <div className='productInfoContainer'>
                    <span>{el.store_name}</span>
                    <span>{el.product_name}</span>
                    <div>
                      <span>{el.price.toLocaleString()}</span>
                      <span>원</span>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </SearchResultsGrid>
    </SearchResultsContainer>
  );
}

const SearchResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 80px 0;

  & > span:nth-child(1) {
    font-size: 18px;

    strong {
      font-size: 20px;
      font-weight: bold;
      color: #21bf48;
    }
  }
`;

const SearchResultsGrid = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;

  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    //grid-template-rows: repeat(5, 1fr);
    gap: 70px 78px;

    li {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      gap: 16px;
      width: 300px;

      .productInfoContainer {
        display: flex;
        flex-direction: column;
        gap: 10px;

        span:nth-child(1) {
          color: #767676;
        }

        span:nth-child(2) {
          font-size: 18px;
        }
        div {
          span:nth-child(1) {
            color: #000000;
            font-weight: bold;
            font-size: 30px;
          }
          span:nth-child(2) {
            color: #000000;
            font-weight: normal;
            font-size: 16px;
          }
        }
      }

      img {
        width: 100%;
        border-radius: 10px;
        border: 1px solid #c4c4c4;
        aspect-ratio: 1/1;
      }
    }
  }
`;

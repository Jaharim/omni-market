import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProductsInfo } from '../apis/api';

interface productObject {
  product_id: number;
  image: string;
  product_info: string;
  store_name: string;
  product_name: string;
  price: number;
}

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage <= 8) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['products', nextPage],
        queryFn: () => getProductsInfo(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  const { data } = useQuery({
    queryKey: ['products', currentPage],
    queryFn: () => getProductsInfo(currentPage),
  });

  console.log(data);

  return (
    <ProductsContainer>
      <button
        disabled={currentPage < 2}
        onClick={() => setCurrentPage((prev) => (prev -= 1))}
      >
        page down
      </button>
      <button
        disabled={currentPage > 8}
        onClick={() => setCurrentPage((prev) => (prev += 1))}
      >
        page up
      </button>
      <ProductsGrid>
        <ul>
          {console.log(data)}
          {data &&
            data.results.map((el: productObject) => {
              return (
                <li key={el.product_id}>
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
      </ProductsGrid>
    </ProductsContainer>
  );
}

const ProductsContainer = styled.div`
  padding-top: 80px;
`;

const ProductsGrid = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;

  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3개의 열(Column) */
    grid-template-rows: repeat(5, 1fr); /* 5개의 행(Row) */
    gap: 70px 78px; /* 아이템 간격 */
    //width: 100%; /* 그리드 컨테이너 너비 */
    height: 1000px; /* 그리드 컨테이너 높이 */
    li {
      display: flex;
      flex-direction: column;
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

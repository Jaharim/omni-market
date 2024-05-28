import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductDetail } from '../apis/api';

interface OrderItemProps {
  productId: number;
  allCost?: number;
  quantity?: number;
  //
}

export default function OrderItem({
  productId,
  allCost,
  quantity,
}: OrderItemProps) {
  const { data, error } = useQuery({
    enabled: !!productId,
    queryKey: ['orderItem', productId],
    queryFn: () => getProductDetail(productId),
  });
  //console.log(productId);
  //console.log(data);
  //console.log(allCost);
  //console.log(error);

  const navigation = useNavigate();

  const linkToProductDetailPage = (productId: number) => {
    navigation(`/omni-market/products/${productId}`);
  };

  return (
    <>
      <OrderItemContainer>
        {data && (
          <div>
            <OrderItemInfo>
              <img
                src={data.image}
                alt='장바구니상품이미지'
                onClick={() => linkToProductDetailPage(data.product_id)}
              />
              <div
                className='basicInfo'
                onClick={() => linkToProductDetailPage(data.product_id)}
              >
                <span>{data.store_name}</span>
                <span>{data.product_name}</span>
                <span>
                  수량 :{' '}
                  {allCost
                    ? Math.floor(allCost / parseInt(data.price))
                    : quantity}
                  개
                </span>
              </div>
            </OrderItemInfo>
            <div>
              <span>-</span>
              <span>
                {data.shipping_fee === 0
                  ? '무료배송'
                  : data.shipping_fee.toLocaleString()}
                {data.shipping_fee ? <span>원</span> : ''}
              </span>
              <span>
                {allCost
                  ? allCost.toLocaleString()
                  : (quantity! * data.price).toLocaleString()}
                원
              </span>
            </div>
          </div>
        )}
      </OrderItemContainer>
    </>
  );
}

const OrderItemContainer = styled.div`
  display: flex;
  position: relative;
  //align-items: center;
  box-sizing: border-box;
  width: 1280px;
  height: 150px;
  padding: 8px 30px 18px;
  margin-bottom: 16px;
  background-color: white;
  border-bottom: 1px solid #c4c4c4;

  & > div {
    display: flex;
    width: 100%;
    //padding: 0 8px;
    & > div:nth-child(2) {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 50%;

      & > span {
        width: calc(100% / 3);
        text-align: center;
        font-size: 18px;
        color: #767676;
      }

      & > span:nth-last-child(1) {
        color: #000;
        font-weight: bold;
      }
    }
  }
`;

const OrderItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  //align-items: center;
  width: 50%;
  height: 100%;
  gap: 36px;

  img {
    align-self: center;
    width: 120px;
    aspect-ratio: 1/1;
    //height: 134px;
    border-radius: 10px;
    cursor: pointer;
  }

  .basicInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //box-sizing: border-box;
    //height: 100%;
    padding: 20px 0px;
    cursor: pointer;

    span:nth-child(1),
    span:nth-child(3) {
      font-size: 16px;
      color: #767676;
    }

    span:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
    }
  }
`;

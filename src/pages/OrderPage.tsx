import Header from '../components/Header';
import styled from 'styled-components';
import OrderItem from '../components/OrderItem';
import InvoiceAndPayment from '../components/InvoiceAndPayment';
import { useLocation } from 'react-router-dom';

export default function OrderPage() {
  const location = useLocation();
  const selectedProductArray = location.state[1];
  const orderKind = location.state[0];
  const quantity = location.state[2];
  const allCost = selectedProductArray.reduce(
    (prev: number, curr: number[]) => prev + curr[1] + curr[2],
    0
  );
  const sumPrice = selectedProductArray.reduce(
    (prev: number, curr: number[]) => prev + curr[1],
    0
  );
  const sumShippingFee = selectedProductArray.reduce(
    (prev: number, curr: number[]) => prev + curr[2],
    0
  );
  //console.log(selectedProductArray);
  //console.log(orderKind);
  //console.log(quantity);
  /* 
  orderKind의 종류
  1. `direct_order`
  2. `cart_order`
  3. `cart_one_order` */

  //console.log(allCost);

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <OrderListContainer>
        <OrderListContents>
          <h2>주문/결제하기</h2>
          <div>
            <span>상품정보</span>
            <div>
              <span>할인</span>
              <span>배송비</span>
              <span>주문금액</span>
            </div>
          </div>
          {selectedProductArray &&
            selectedProductArray.map((el: number[]) => {
              return (
                <OrderItem
                  key={crypto.randomUUID()}
                  productId={el[0]}
                  allCost={el[1]}
                />
              );
            })}
          <div>
            <span>총 주문금액</span>
            <span>{allCost.toLocaleString()}원</span>
          </div>
          {/* {data?.count !== 0 &&
            data?.results.map((el: CartItem) => {
              return (
                <CartItem
                  key={el.cart_item_id}
                  productId={el.product_id}
                  count={el.quantity}
                  cartItemId={el.cart_item_id}
                  isActive={el.is_active}
                  onSelected={handleMapStateChange}
                  onDelete={handleCartItemDelete}
                  allInserted={isSelected.toString()}
                />
              );
            })} */}
        </OrderListContents>
      </OrderListContainer>
      <InvoiceAndPayment
        orderKind={orderKind}
        productId={selectedProductArray[0][0]}
        sumPrice={sumPrice}
        sumShippingFee={sumShippingFee}
        quantity={quantity}
      />
    </>
  );
}

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 60px 0;
`;

const OrderListContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  //padding: 22px;

  & > h2 {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 52px;
  }

  & > div:nth-child(2) {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 1280px;
    height: 60px;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 16px;
    background-color: #f2f2f2;
    font-size: 18px;
    font-weight: bold;
    color: black;

    & > span:nth-child(1) {
      width: 50%;
      text-align: center;
    }

    & > div:nth-child(2) {
      display: flex;
      justify-content: space-between;
      width: 50%;
      & > span {
        display: inline-block;
        width: calc(100% / 3);
        text-align: center;
      }
    }
  }

  & > div:nth-last-child(1) {
    display: flex;
    width: 100%;
    margin-top: 14px;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    span {
      font-weight: bold;
    }

    span:nth-child(1) {
      font-size: 18px;
      color: black;
    }
    span:nth-child(2) {
      font-size: 24px;
      color: #eb5757;
    }
  }
`;

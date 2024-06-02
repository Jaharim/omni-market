import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReducer, useEffect, useState, SyntheticEvent } from 'react';
import { deleteAllCartItem, getCartData } from '../../apis/api';
import styled from 'styled-components';
import Header from '../../components/Header';
import CartItem from '../Cart/CartItem';
import minusIcon from '../../assets/icon-minus-line.svg';
import plusIcon from '../../assets/icon-plus-line.svg';
import deleteIcon from '../../assets/icon-delete.svg';
import { useNavigate } from 'react-router-dom';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;
type CartItem = {
  cart_item_id: number;
  is_active: boolean;
  my_cart: number;
  product_id: number;
  quantity: number;
};

interface SelectedCartItemInfo {
  isSelected: boolean;
  productId: number;
  cost: number;
  shippingFee: number;
}

interface CartCost {
  productCost: number;
  shippingFee: number;
}

type State = Map<number, SelectedCartItemInfo>;

/* type Action = {
  type: 'UPDATE' | 'DELETE' | 'DELETE_ALL';
  value: SelectedCartItemInfo | '';
}; */

type UpdateAction = {
  type: 'UPDATE';
  value: SelectedCartItemInfo;
};

type DeleteAction = {
  type: 'DELETE';
  value: SelectedCartItemInfo;
};

type DeleteAllAction = {
  type: 'DELETE_ALL';
  value: '';
};

type Action = UpdateAction | DeleteAction | DeleteAllAction;

const initialState: State = new Map();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE': {
      const newState = new Map(state);
      newState.set(action.value.productId, action.value);
      return newState;
    }
    case 'DELETE': {
      const newState = new Map(state);
      newState.delete(action.value.productId);
      ////console.log(newState);
      return newState;
    }
    case 'DELETE_ALL': {
      const newState = new Map();
      return newState;
    }
    default:
      return state;
  }
};

export default function Cart() {
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const [token, setToken] = useState('');

  const [selectedProductId, setSelectedProductId] = useState<number[][]>();
  const [allCost, setAllCost] = useState<CartCost>({
    productCost: 0,
    shippingFee: 0,
  });
  const [isSelected, setIsSelected] = useState(false);

  const [confirmDeleteAllModalOpen, setConfirmDeleteAllModalOpen] =
    useState(false);
  const [deleteAllCompleteModalOpen, setDeleteAllCompleteModalOpen] =
    useState(false);

  const [mapState, dispatch] = useReducer(reducer, initialState);

  const handleMapStateChange = (value: SelectedCartItemInfo) => {
    dispatch({ type: 'UPDATE', value });
  };

  queryClient.setQueryDefaults(['loginInfo'], {
    gcTime: 1000,
  });

  useEffect(() => {
    let loginInfo: LoginInfo = queryClient.getQueryData(['loginInfo']);
    const authInfoString = localStorage.getItem('authInfo');
    if (!loginInfo) {
      const { id, token, loginType } = JSON.parse(authInfoString!);
      queryClient.setQueryData(['loginInfo'], {
        id,
        token,
        loginType,
      });
    }
    loginInfo = queryClient.getQueryData(['loginInfo']);
    const token = loginInfo!.token;
    if (loginInfo) {
      queryClient.invalidateQueries({
        queryKey: ['cartData'],
      });
      setToken(token);
    }
  }, [queryClient, token]);

  useEffect(() => {
    if (token) {
      ////console.log(token);
      refetch();
    }
  }, [token]);

  const { data, refetch } = useQuery({
    enabled: token !== '',
    queryKey: ['cartData', token],
    queryFn: () => getCartData(token),
    refetchOnWindowFocus: false,
  });

  ////console.log(error);

  const handleInsertAllOrderList = () => {
    setIsSelected((prev) => !prev);
  };

  const handleCartItemDelete = (value: SelectedCartItemInfo) => {
    dispatch({ type: 'DELETE', value });
    queryClient.invalidateQueries({ queryKey: ['cartData'] });
  };

  const deleteAllCartItemMutation = useMutation({
    mutationFn: () => deleteAllCartItem(token),
    onSuccess: () => {
      setConfirmDeleteAllModalOpen(false);
      setDeleteAllCompleteModalOpen(true);
    },
  });

  const handleDeleteAllCartItem = () => {
    deleteAllCartItemMutation.mutate();
  };

  const handleConfirmDeleteAllModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      /*   if (data && token) {
  } */
      setConfirmDeleteAllModalOpen(false);
    }
  };

  const handlDeleteAllCompleteModalClose = (e: SyntheticEvent) => {
    if (e.target !== e.currentTarget) return;
    else {
      /*   if (data && token) {
  } */
      dispatch({ type: 'DELETE_ALL', value: '' });
      queryClient.invalidateQueries({ queryKey: ['cartData'] });
      setDeleteAllCompleteModalOpen(false);
    }
  };

  useEffect(() => {
    let newProductCost = 0;
    let newShippingFee = 0;
    const newSelectedProductsInfo = [];
    for (const [, value] of mapState) {
      if (value.isSelected) {
        newProductCost += value.cost;
        newShippingFee += value.shippingFee;

        newSelectedProductsInfo.push([
          value.productId,
          value.cost,
          value.shippingFee,
        ]);
        setAllCost({
          productCost: newProductCost,
          shippingFee: newShippingFee,
        });
        setSelectedProductId(newSelectedProductsInfo);
      } else {
        setAllCost({
          productCost: newProductCost,
          shippingFee: newShippingFee,
        });
        setSelectedProductId(newSelectedProductsInfo);
      }
    }
  }, [mapState, token, data]);

  ////console.log(data);
  ////console.log(mapState);
  //console.log(selectedProductId);
  ////console.log(token);
  /* 
  const getOrderListMutation = useMutation({
    mutationFn: () => getOrderList(token),
    onSuccess: (data) => {
      //console.log(data);
    },
  }); */

  const handleTestOrder = () => {
    //getOrderListMutation.mutate();
    navigation('/omni-market/order', {
      state: ['cart_order', selectedProductId],
    });
  };

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <CartContainer>
        <CartContents>
          <h2>장바구니</h2>
          <div>
            <Button
              type='button'
              onClick={handleInsertAllOrderList}
              $select={isSelected.toString()}
            ></Button>
            <span>상품정보</span>
            <span>수량</span>
            <span>상품금액</span>
            <button onClick={() => setConfirmDeleteAllModalOpen(true)}>
              <img src={deleteIcon} alt='삭제아이콘' />
            </button>
          </div>
          {data?.count === 0 && (
            <EmptyCartContainer>
              <span>장바구니에 담긴 상품이 없습니다.</span>
              <span>원하는 상품을 장바구니에 담아보세요!</span>
            </EmptyCartContainer>
          )}
          {data?.count !== 0 &&
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
            })}
          {data?.count !== 0 && (
            <>
              <OrderAmountContainer>
                <FeeContent>
                  <span>총 상품금액</span>
                  <span>
                    {allCost.productCost.toLocaleString()}
                    <span>원</span>
                  </span>
                </FeeContent>
                <div>
                  <img src={minusIcon} alt='마이너스아이콘' />
                </div>
                <FeeContent>
                  <span>상품 할인</span>
                  <span>
                    {'0'.toLocaleString()}
                    <span>원</span>
                  </span>
                </FeeContent>
                <div>
                  <img src={plusIcon} alt='플러스아이콘' />
                </div>
                <FeeContent>
                  <span>배송비</span>
                  <span>
                    {allCost.shippingFee.toLocaleString()}
                    <span>원</span>
                  </span>
                </FeeContent>
                <div>
                  <span>결제 예정 금액</span>
                  <span>
                    {(
                      allCost.productCost + allCost.shippingFee
                    ).toLocaleString()}
                    <span>원</span>
                  </span>
                </div>
              </OrderAmountContainer>
              <button type='button' onClick={handleTestOrder}>
                주문하기
              </button>
            </>
          )}
        </CartContents>
      </CartContainer>
      {confirmDeleteAllModalOpen && (
        <ConfirmDeleteAllModalBackDrop
          onClick={handleConfirmDeleteAllModalClose}
        >
          <div>
            <span>모든 상품을 삭제하시겠습니까?</span>
            <div>
              <button type='button' onClick={handleConfirmDeleteAllModalClose}>
                취소
              </button>
              <button type='button' onClick={handleDeleteAllCartItem}>
                삭제하기
              </button>
            </div>
          </div>
        </ConfirmDeleteAllModalBackDrop>
      )}
      {deleteAllCompleteModalOpen && (
        <DeleteAllCompleteModalBackDrop
          onClick={handlDeleteAllCompleteModalClose}
        >
          <div>
            <span>모든 상품이 삭제되었습니다.</span>
            <button type='button' onClick={handlDeleteAllCompleteModalClose}>
              확인
            </button>
          </div>
        </DeleteAllCompleteModalBackDrop>
      )}
    </>
  );
}
const Button = styled.button<{ $select: string }>`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background-color: ${(props) =>
      props.$select === 'true' ? '#21bf48' : '#f2f2f2'};
  }
`;
const FeeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  & > span {
    font-size: 16px;
  }

  span:nth-child(2) {
    display: flex;
    align-items: baseline;
    font-size: 24px;
    font-weight: bold;
    span {
      font-size: 16px;
      font-weight: normal;
    }
  }
`;

const OrderAmountContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 1280px;
  height: 150px;
  margin-top: 70px;
  margin-bottom: 40px;
  border-radius: 10px;
  background-color: #f2f2f2;

  & > div:nth-child(2),
  & > div:nth-child(4) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: white;
  }

  & > div:nth-last-child(1) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    font-size: 16px;
    font-weight: bold;

    span:nth-child(2) {
      font-size: 36px;
      color: #eb5757;

      span {
        font-size: 18px;
        font-weight: normal;
      }
    }
  }
`;

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 60px 0;
`;

const CartContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px;

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
    padding-right: 130px;
    margin-bottom: 35px;
    background-color: #f2f2f2;
    font-size: 18px;
    font-weight: bold;
    color: black;

    & > button {
      width: 20px;
      height: 20px;
      background-color: unset;
      border-radius: 10px;
      border: 1px solid #21bf48;
      cursor: pointer;
    }

    & > button:nth-last-child(1) {
      position: absolute;
      width: 34px;
      top: 18px;
      right: 18px;
      background-color: unset;
      border: none;
      cursor: pointer;
    }

    & > span:nth-child(3) {
      transform: translateX(26px);
    }
  }

  & > button:nth-last-child(1) {
    width: 220px;
    height: 68px;
    border-radius: 5px;
    font-size: 24px;
    font-weight: bold;
    background-color: #21bf48;
    border: none;
    color: white;
    cursor: pointer;
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 17px;

  & > span:nth-child(1) {
    font-size: 22px;
    font-weight: bold;
  }

  & > span:nth-child(2) {
    font-size: 16px;
    color: #767676;
  }
`;

const ConfirmDeleteAllModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
    }

    & > div {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 10px;
    }

    & > div > button:nth-child(1) {
      width: 80px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }

    & > div > button:nth-child(2) {
      width: 150px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #21bf48;
      cursor: pointer;
    }
  }
`;

const DeleteAllCompleteModalBackDrop = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 250px;
    border-radius: 10px;
    background-color: white;
    z-index: 2000;
    gap: 40px;

    & > span {
      font-size: 20px;
      font-weight: bold;
      //margin-bottom: 35px;
    }

    & > button {
      width: 120px;
      height: 60px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #767676;
      cursor: pointer;
    }
  }
`;

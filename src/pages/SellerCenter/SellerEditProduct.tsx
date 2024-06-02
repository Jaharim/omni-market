import React, {
  useReducer,
  ChangeEvent,
  useState,
  useRef,
  FormEvent,
  useEffect,
} from 'react';
import styled from 'styled-components';
import SellerCenterHeader from '../SellerCenter/SellerCenterHeader';
import defaultImageIcon from '../../assets/icon-img.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addSellingProduct,
  editSellingProduct,
  getProductDetail,
} from '../../apis/api';

type LoginInfo = { id: string; token: string; loginType: string } | undefined;

interface State {
  productName: string;
  image: File | string | null;
  price: number;
  shippingMethod: 'PARCEL' | 'DELIVERY';
  shippingFee: number;
  stock: number;
}

type Action =
  | { type: 'SET_PRODUCT_NAME'; payload: string }
  | { type: 'SET_IMAGE'; payload: File | string | null }
  | { type: 'SET_PRICE'; payload: number }
  | { type: 'SET_SHIPPING_METHOD'; payload: 'PARCEL' | 'DELIVERY' }
  | { type: 'SET_SHIPPING_FEE'; payload: number }
  | { type: 'SET_STOCK'; payload: number };

const initialState: State = {
  productName: '',
  image: null,
  price: 0,
  shippingMethod: 'PARCEL',
  shippingFee: 0,
  stock: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PRODUCT_NAME':
      return { ...state, productName: action.payload };
    case 'SET_IMAGE':
      return { ...state, image: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload };
    case 'SET_SHIPPING_FEE':
      return { ...state, shippingFee: action.payload };
    case 'SET_STOCK':
      return { ...state, stock: action.payload };
    default:
      return state;
  }
}

export default function SellerEditProduct() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editedProductId = queryParams.get('editedProductId');
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const [token, setToken] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'PARCEL' | 'DELIVERY'>(
    'PARCEL'
  );

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
      ////console.log(loginInfo);
      setToken(token);
    }
    if (!editedProductId) {
      queryClient.removeQueries({ queryKey: ['editedProduct'] });
    }
  }, [queryClient, editedProductId]);

  const { data } = useQuery({
    enabled: !!editedProductId,
    queryKey: ['editedProduct'],
    queryFn: () => getProductDetail(editedProductId),
  });

  //console.log(data);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_IMAGE', payload: data.image });
      setPreview(data.image);
      dispatch({ type: 'SET_SHIPPING_METHOD', payload: data.shipping_method });
      dispatch({ type: 'SET_PRODUCT_NAME', payload: data.product_name });
      dispatch({ type: 'SET_PRICE', payload: parseInt(data.price) });
      dispatch({
        type: 'SET_SHIPPING_FEE',
        payload: parseInt(data.shipping_fee),
      });
      dispatch({ type: 'SET_STOCK', payload: parseInt(data.stock) });
    }
  }, [data]);

  const handleInputScroll = (e: React.WheelEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.blur();
  };

  const handleShippingMethod = (method: 'PARCEL' | 'DELIVERY') => {
    setShippingMethod(method);
    dispatch({ type: 'SET_SHIPPING_METHOD', payload: method });
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (
      files &&
      files.length > 0 &&
      !(files[0].type === 'image/jpeg') &&
      !(files[0].type === 'image/jpg') &&
      !(files[0].type === 'image/png') &&
      !(files[0].type === 'image/gif')
    ) {
      setErrorMessage('이미지 파일의 형식이 잘못되었습니다.');
      dispatch({ type: 'SET_IMAGE', payload: null });
      setPreview(null);
    } else if (name === 'productImage' && files && files.length > 0) {
      const file = files[0];
      dispatch({ type: 'SET_IMAGE', payload: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    } else {
      switch (name) {
        case 'productName':
          dispatch({ type: 'SET_PRODUCT_NAME', payload: value });
          break;
        case 'price':
          dispatch({ type: 'SET_PRICE', payload: parseInt(value) });
          break;
        case 'shippingFee':
          dispatch({ type: 'SET_SHIPPING_FEE', payload: parseInt(value) });
          break;
        case 'stock':
          dispatch({ type: 'SET_STOCK', payload: parseInt(value) });
          break;
        default:
          break;
      }
    }
  };

  const addProductPostMutation = useMutation({
    mutationFn: () => addSellingProduct(token, state),
    onSuccess: () => {
      navigation('/omni-market/sellerCenter');
    },
    onError: (err) => {
      //console.log(err);
    },
  });

  const editProductMutation = useMutation({
    mutationFn: () => editSellingProduct(token, editedProductId!, state),
    onSuccess: () => {
      navigation('/omni-market/sellerCenter');
    },
    onError: (err) => {
      //console.log(err);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!state.image) {
      setErrorMessage('이미지 파일을 첨부해주세요');

      return;
    }
    if (errorMessage !== '') {
      //console.log('크악2');
      return;
    }
    //console.log('submit success!');

    if (!data) {
      //console.log('new product added!');
      addProductPostMutation.mutate();
    } else if (data) {
      //console.log('exist product edited!');
      editProductMutation.mutate();
    }
  };

  //console.log(state);
  ////console.log(errors);

  return (
    <>
      <HeaderContainer>
        <SellerCenterHeader />
      </HeaderContainer>
      <EditProductContainer>
        <EditProductWrapper>
          <span>상품 {editedProductId ? '수정' : '등록'}</span>
          <EditProductContents>
            <div>
              <span>*상품 등록 주의사항</span>
              <ul>
                <li>- 너무 귀여운 사진은 심장이 아파올 수 있습니다.</li>
                <br />
                <li>
                  - 유소년에게서 천자만홍이 피고 이상이 온갖 들어 약동하다.
                  이상의 가지에 사랑의 있는가? 주며, 끓는 힘차게 얼음이 얼음
                  가치를 황금시대의 있음으로써 사라지지 것이다. 이 뜨거운지라,
                  이상의 속에서 이것은 피가 보배를 황금시대의 싹이 사막이다.
                </li>
                <br />
                <li>
                  - 자신과 우는 옷을 지혜는 아니다. 더운지라 설레는 기쁘며,
                  위하여서, 평화스러운 광야에서 그리하였는가? 소담스러운 위하여
                  인도하겠다는 어디 무엇을 이상을 같지 따뜻한 청춘 칼이다.
                </li>
                <br />
                <li>
                  - 가치를 그들을 예수는 찬미를 가슴이 과실이 이것이다. 희망의
                  것이다.보라, 풍부하게 이것은 황금시대를 얼마나 인간에 돋고,
                  이것이다.
                </li>
              </ul>
            </div>
            <form onSubmit={onSubmit}>
              {/* 2 */}
              <div>
                {/* 2-1 */}
                <div>
                  {/* 2-1-1 */}
                  <label htmlFor='productImage'>상품이미지</label>
                  <ImageInputContainer
                    $preview={preview}
                    onClick={handleFileInputClick}
                  >
                    <img
                      src={preview ? preview : defaultImageIcon}
                      alt='상품이미지'
                    />
                    <input
                      type='file'
                      accept='image/*'
                      name='productImage'
                      onChange={handleInputChange}
                      ref={fileInputRef}
                    />
                  </ImageInputContainer>
                </div>
                <div>
                  {/* 2-1-2 */}
                  <div>
                    {/* 2-1-2-1 */}
                    <label htmlFor='productName'>상품명</label>
                    <div>
                      <input
                        type='text'
                        name='productName'
                        value={state.productName}
                        maxLength={20}
                        onChange={handleInputChange}
                        required
                      />
                      <span>{state.productName.length}/20</span>
                    </div>
                  </div>
                  <div>
                    {/* 2-1-2-2 */}
                    <label htmlFor='price'>판매가</label>
                    <div>
                      <input
                        type='number'
                        value={state.price}
                        name='price'
                        min={0}
                        onChange={(e) => handleInputChange(e)}
                        onWheel={handleInputScroll}
                        required
                      />
                      <span>원</span>
                    </div>
                  </div>
                  <div>
                    {/* 2-1-2-3 */}
                    <label htmlFor='shippingMethod'>배송방법</label>
                    <ShippingMethodButtons $styleProps={shippingMethod}>
                      <button
                        type='button'
                        name='shippingMethod'
                        value={'PARCEL'}
                        onClick={() => {
                          handleShippingMethod('PARCEL');
                        }}
                      >
                        택배, 소포, 등기
                      </button>
                      <button
                        type='button'
                        name='shippingMethod'
                        value={'DELIVERY'}
                        onClick={() => {
                          handleShippingMethod('DELIVERY');
                        }}
                      >
                        직접배송(화물배달)
                      </button>
                    </ShippingMethodButtons>
                  </div>
                  <div>
                    <label htmlFor='shippingFee'>기본 배송비</label>
                    <div>
                      <input
                        type='number'
                        name='shippingFee'
                        min={0}
                        value={state.shippingFee}
                        onWheel={handleInputScroll}
                        onChange={handleInputChange}
                        required
                      />
                      <span>원</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor='stock'>재고</label>
                    <div>
                      <input
                        type='number'
                        name='stock'
                        min={0}
                        value={state.stock}
                        onWheel={handleInputScroll}
                        onChange={handleInputChange}
                        required
                      />
                      <span>개</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* 2-2 */}
                <span className={errorMessage ? '' : 'a11y-hidden'}>
                  {errorMessage}
                </span>
                <button
                  type='button'
                  onClick={() => navigation('/omni-market/sellerCenter')}
                >
                  취소
                </button>
                <button type='submit'>저장하기</button>
              </div>
            </form>
          </EditProductContents>
        </EditProductWrapper>
      </EditProductContainer>
    </>
  );
}

const ShippingMethodButtons = styled.div<{
  $styleProps: 'PARCEL' | 'DELIVERY';
}>`
  display: flex;

  & > button:nth-child(1),
  & > button:nth-child(2) {
    width: 220px;
    height: 54px;
    margin-right: 10px;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    cursor: pointer;
  }

  & > button:nth-child(1) {
    background-color: ${(props) =>
      props.$styleProps === 'PARCEL' ? '#21bf48' : 'white'};
    border: ${(props) =>
      props.$styleProps === 'PARCEL' ? 'none' : '1px solid #c4c4c4'};
    color: ${(props) => (props.$styleProps === 'PARCEL' ? 'white' : '#767676')};
  }

  & > button:nth-child(2) {
    background-color: ${(props) =>
      props.$styleProps === 'DELIVERY' ? '#21bf48' : 'white'};
    border: ${(props) =>
      props.$styleProps === 'DELIVERY' ? 'none' : '1px solid #c4c4c4'};
    color: ${(props) =>
      props.$styleProps === 'DELIVERY' ? 'white' : '#767676'};
  }
`;

const ImageInputContainer = styled.div<{ $preview: string | null }>`
  position: relative;
  width: 454px;
  height: 454px;
  border: none;
  background-color: #c4c4c4;

  & > img {
    position: absolute;
    top: ${(props) => (props.$preview ? '0' : '50%')};
    left: ${(props) => (props.$preview ? '0' : '50%')};
    width: ${(props) => (props.$preview ? '100%' : '')};
    height: ${(props) => (props.$preview ? '100%' : '')};
    transform: ${(props) => (props.$preview ? '' : 'translate(-50%, -50%)')};
  }

  & > input {
    display: none;
  }
`;

const EditProductContents = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;

  & > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 320px;
    gap: 10px;

    & > span:nth-child(1) {
      font-size: 16px;
      color: #eb5757;
    }

    & > ul {
      width: 200px;
      background-color: #ffefe8;
      padding: 20px;

      & > li {
        font-size: 14px;
        line-height: 17px;
      }
    }
  }

  & > form:nth-child(2) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 40px;

    label {
      display: inline-block;
      margin-bottom: 10px;
      font-size: 16px;
      color: #767676;
    }
    & > div:nth-child(1) {
      display: flex;
      flex-direction: row;
      gap: 40px;

      & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 16px;

        & > div:nth-child(1) {
          div {
            position: relative;

            input {
              box-sizing: border-box;
              width: 100%;
              height: 54px;
              border: 1px solid #c4c4c4;
              border-radius: 5px;
              padding-left: 16px;
              font-size: 16px;
              outline: none;
            }

            span {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 16px;
              font-size: 14px;
              color: #c4c4c4;
            }
          }
        }

        & > div:nth-child(2),
        & > div:nth-child(4),
        & > div:nth-child(5) {
          div {
            position: relative;
            width: 220px;
            height: 54px;

            input {
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              border: 1px solid #c4c4c4;
              border-radius: 5px;
              padding-left: 16px;
              font-size: 16px;
              outline: none;
            }

            span {
              box-sizing: border-box;
              position: absolute;
              width: 54px;
              height: 54px;
              top: 50%;
              transform: translateY(-50%);
              right: 0;
              border-radius: 0 5px 5px 0;
              font-size: 16px;
              text-align: center;
              line-height: 54px;
              background-color: #c4c4c4;
              color: white;
            }
          }
        }

        /* & > div:nth-child(3) {
          & > div {
            display: flex;
          }
        } */
      }
    }

    & > div:nth-child(2) {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      gap: 14px;

      & > span {
        margin-right: auto;
        color: #eb5757;
      }

      & > button {
        width: 130px;
        height: 60px;
        border-radius: 5px;
        font-size: 16px;
        border: none;
        cursor: pointer;
      }

      & > button:nth-child(2) {
        border: 1px solid #c4c4c4;
        background-color: white;
        color: #767676;
      }
      & > button:nth-child(3) {
        background-color: #21bf48;
        color: white;
      }
    }
  }
`;

const HeaderContainer = styled.div`
  box-shadow: 0px 0px 15px rgba(0 0 0 / 20%);
`;

const EditProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  padding: 44px 0;

  .a11y-hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }
`;

const EditProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 22px 100px;
  gap: 50px;

  & > span:nth-child(1) {
    font-size: 32px;
    font-weight: bold;
  }
`;

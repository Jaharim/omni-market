import axios from 'axios';

const API_URL = process.env.API_URL;

interface AddProductState {
  productName: string;
  image: File | string | null;
  price: number;
  shippingMethod: 'PARCEL' | 'DELIVERY';
  shippingFee: number;
  stock: number;
}

interface EditProductState {
  productName: string;
  image: File | string | null;
  price: number;
  shippingMethod: 'PARCEL' | 'DELIVERY';
  shippingFee: number;
  stock: number;
}

interface CartOrderInfo {
  totalPrice: number; // cart에 담긴 총 금액(수량*가격+배송비)을 보내줘야 합니다.
  orderKind: string; // 카트에서 주문할 경우에는 cart_order를 보내줘야 합니다.
  receiver: string;
  receiverPhoneNumber: string; // 01012341234 와 같은 형태로 보내야 합니다.
  address: string;
  message: string;
  paymentMethod: 'CARD' | 'DEPOSIT' | 'PHONE_PAYMENT' | 'NAVERPAY' | 'KAKAOPAY'; //CARD, DEPOSIT, PHONE_PAYMENT, NAVERPAY, KAKAOPAY 중 하나 선택
}

interface SingleOrderInfo extends CartOrderInfo {
  productId: number;
  quantity: number;
}

interface SignUpType {
  username: string;
  password: string;
  password2: string;
  phone_number: string; // 전화번호는 010으로 시작하는 10~11자리 숫자
  name: string;
  sellerId?: string;
  storeName?: string;
}

export const getProductsInfo = async (page: number) => {
  const { data } = await axios.get(`${API_URL}/products/?page=${page}`);
  return data;
};

export const searchProducts = async (input: string | null | undefined) => {
  console.log(input);
  if (input) {
    const { data } = await axios.get(`${API_URL}/products/?search=${input}`);
    return data;
  }
};

export const getProductDetail = async (
  productId: string | number | undefined | null
) => {
  const { data } = await axios.get(`${API_URL}/products/${productId}`);
  return data;
};

export const login = async (loginInfo: {
  id: string;
  password: string;
  loginType: string;
}) => {
  const { data } = await axios
    .post(`${API_URL}/accounts/login/`, {
      username: loginInfo.id,
      password: loginInfo.password,
      login_type: loginInfo.loginType,
    })
    .catch(function (error) {
      //console.log(error.config);
      if (error.response) {
        // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
        //console.log(error.response.data);
        return error.response.data;
        //console.log(error.response.status);
        //console.log(error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
        // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
        // node.js에서는 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        return error.request;
      } else {
        // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
        //console.log('Error', error.message);
        return error.message;
      }
    });

  const authInfo = {
    id: data.id,
    token: data.token,
    loginType: loginInfo.loginType,
  };

  //console.log(loginInfo);
  //console.log(data);
  localStorage.setItem('authInfo', JSON.stringify(authInfo));

  return data;
};

export const getCartData = async (token: string) => {
  if (token) {
    const { data } = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return data;
  } else {
    throw new Error('Token is missing');
  }
};

export const addProductToCart = async (
  token: string,
  productId: number,
  quantity: number,
  check: boolean
) => {
  console.log(token, productId, quantity, check);
  const { data } = await axios.post(
    `${API_URL}/cart/`,
    {
      product_id: productId,
      quantity: quantity,
      // check: check,
    },
    {
      headers: { Authorization: `JWT ${token}` },
    }
  );
  return data;
};

export const deleteCartItem = async (token: string, cartItemId: number) => {
  const { data } = await axios.delete(`${API_URL}/cart/${cartItemId}/`, {
    headers: { Authorization: `JWT ${token}` },
  });
  return data;
};

export const deleteAllCartItem = async (token: string) => {
  const { data } = await axios.delete(`${API_URL}/cart/`, {
    headers: { Authorization: `JWT ${token}` },
  });
  return data;
};

export const changeCartItemQuantity = async (
  cartItemId: number,
  token: string,
  productId: number,
  quantity: number,
  isActive: boolean
) => {
  //console.log({ cartItemId, productId, quantity, isActive });
  if (token) {
    const { data } = await axios.put(
      `${API_URL}/cart/${cartItemId}/`,
      {
        product_id: productId,
        quantity,
        is_active: isActive,
      },
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );
    return data;
  }
};

export const getSellingProducts = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/seller/`, {
    headers: { Authorization: `JWT ${token}` },
  });
  return data;
};

export const editSellingProduct = async (
  token: string,
  productId: string,
  state: EditProductState
) => {
  //if(typeof state.image)
  //console.log(typeof state.image === 'string');
  let imageProperty;
  if (typeof state.image === 'string') {
    const { data } = await axios.put(
      `${API_URL}/products/${productId}/`,
      {
        product_name: state.productName,
        price: state.price,
        shipping_method: state.shippingMethod,
        shipping_fee: state.shippingFee,
        stock: state.stock,
        product_info: `${state.productName}입니다.`,
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } else {
    const { data } = await axios.put(
      `${API_URL}/products/${productId}/`,
      {
        product_name: state.productName,
        image: imageProperty,
        price: state.price,
        shipping_method: state.shippingMethod,
        shipping_fee: state.shippingFee,
        stock: state.stock,
        product_info: `${state.productName}입니다.`,
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  }
  /*  const { data } = await axios.put(
    `${API_URL}/products/${productId}/`,
    {
      product_name: state.productName,
      image: imageProperty,
      price: state.price,
      shipping_method: state.shippingMethod,
      shipping_fee: state.shippingFee,
      stock: state.stock,
      product_info: `${state.productName}입니다.`,
    },
    {
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data; */
};

export const deleteSellingProduct = async (
  token: string,
  productId: number
) => {
  const { data } = await axios.delete(`${API_URL}/products/${productId}/`, {
    headers: { Authorization: `JWT ${token}` },
  });
  return data;
};

export const addSellingProduct = async (
  token: string,
  state: AddProductState
) => {
  /* const formData = new FormData();
  formData.append('product_name', state.productName);
  formData.append('image', state.image!);
  formData.append('price', state.price);
  formData.append('shipping_method', state.shippingMethod);
  formData.append('shipping_fee', state.shippingFee.toString());
  formData.append('stock', state.stock.toString());
  formData.append('product_info', ''); */

  const { data } = await axios.post(
    `${API_URL}/products/`,
    {
      product_name: state.productName,
      image: state.image,
      price: state.price,
      shipping_method: state.shippingMethod,
      shipping_fee: state.shippingFee,
      stock: state.stock,
      product_info: `${state.productName}입니다.`,
    },
    {
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

export const getOrderList = async (token: string, pageNum: number) => {
  const { data } = await axios.get(`${API_URL}/order/?page=${pageNum}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
};

export const postOrder = async (
  token: string,
  orderInfo: CartOrderInfo | SingleOrderInfo
) => {
  if (orderInfo.orderKind === 'cart_order') {
    const { data } = await axios.post(
      `${API_URL}/order/`,
      {
        total_price: orderInfo.totalPrice, // cart에 담긴 총 금액(수량*가격+배송비)을 보내줘야 합니다.
        order_kind: orderInfo.orderKind, // 카트에서 주문할 경우에는 cart_order를 보내줘야 합니다.
        receiver: orderInfo.receiver,
        receiver_phone_number: orderInfo.receiverPhoneNumber, // 01012341234 와 같은 형태로 보내야 합니다.
        address: orderInfo.address,
        address_message: orderInfo.message,
        payment_method: orderInfo.paymentMethod,
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return data;
  } else {
    const { data } = await axios.post(
      `${API_URL}/order/`,
      {
        product_id: (orderInfo as SingleOrderInfo).productId,
        quantity: (orderInfo as SingleOrderInfo).quantity,
        total_price: orderInfo.totalPrice, // cart에 담긴 총 금액(수량*가격+배송비)을 보내줘야 합니다.
        order_kind: orderInfo.orderKind, // 카트에서 주문할 경우에는 cart_order를 보내줘야 합니다.
        receiver: orderInfo.receiver,
        receiver_phone_number: orderInfo.receiverPhoneNumber, // 01012341234 와 같은 형태로 보내야 합니다.
        address: orderInfo.address,
        address_message: orderInfo.message,
        payment_method: orderInfo.paymentMethod,
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return data;
  }
};

export const authUserName = async (userName: string) => {
  const { data } = await axios.post(
    `${API_URL}/accounts/signup/valid/username/`,
    {
      username: userName,
    }
  );
  //console.log(userName);
  return data;
};

export const authSellerId = async (sellerId: string | undefined) => {
  const { data } = await axios.post(
    `${API_URL}/accounts/signup/valid/company_registration_number/`,
    {
      company_registration_number: sellerId,
    }
  );
  //console.log(userName);
  return data;
};

export const signUp = async (
  SignUpInfo: SignUpType,
  SignUpType: 'BUYER' | 'SELLER'
) => {
  if (SignUpType === 'BUYER') {
    const { data } = await axios.post(`${API_URL}/accounts/signup/`, {
      username: SignUpInfo.username, // 아이디
      password: SignUpInfo.password,
      password2: SignUpInfo.password2,
      phone_number: SignUpInfo.phone_number, // 전화번호는 010으로 시작하는 10~11자리 숫자
      name: SignUpInfo.name, // 이름
    });
    return data;
  } else {
    const { data } = await axios.post(`${API_URL}/accounts/signup_seller/`, {
      username: SignUpInfo.username, // 아이디
      password: SignUpInfo.password,
      password2: SignUpInfo.password2,
      phone_number: SignUpInfo.phone_number, // 전화번호는 010으로 시작하는 10~11자리 숫자
      name: SignUpInfo.name, // 이름
      company_registration_number: SignUpInfo.sellerId,
      store_name: SignUpInfo.storeName,
    });
    return data;
  }
};

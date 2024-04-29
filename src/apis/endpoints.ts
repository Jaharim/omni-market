/* // 사용되는 모든 API 엔드포인트를 정의하는 파일입니다.

// 각 엔드포인트의 경로를 정의합니다.
export const API_ENDPOINTS = {
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
};

// 각 엔드포인트에 대한 HTTP 메서드를 정의할 수도 있습니다.
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// 예를 들어, 사용자 목록을 가져오는 엔드포인트를 정의할 수 있습니다.
export const USER_ENDPOINTS = {
  GET_USERS: { path: API_ENDPOINTS.USERS, method: HTTP_METHODS.GET },
  ADD_USER: { path: API_ENDPOINTS.USERS, method: HTTP_METHODS.POST },
  UPDATE_USER: {
    path: `${API_ENDPOINTS.USERS}/:userId`,
    method: HTTP_METHODS.PUT,
  },
  DELETE_USER: {
    path: `${API_ENDPOINTS.USERS}/:userId`,
    method: HTTP_METHODS.DELETE,
  },
};

// 다른 엔드포인트들을 여기에 추가할 수 있습니다.
 */

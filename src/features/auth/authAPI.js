import { GET, POST } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';

export const authAPI = {
  login: (payload, signal) => POST(ENDPOINT.AUTH.LOGIN, payload, signal),
  register: (payload, signal) => POST(ENDPOINT.AUTH.REGISTER, payload, signal),
  forgotPassword: (payload, signal) => POST(ENDPOINT.AUTH.FORGOT_PASSWORD, payload, signal),
  verifyOtp: (payload, signal) => POST(ENDPOINT.AUTH.VERIFY_OTP, payload, signal),
  resetPassword: (payload, signal) => POST(ENDPOINT.AUTH.RESET_PASSWORD, payload, signal),
  fetchMe: (signal) => GET(ENDPOINT.AUTH.ME, {}, signal),
  logout: (signal) => POST(ENDPOINT.AUTH.LOGOUT, {}, signal),
};

export default authAPI;
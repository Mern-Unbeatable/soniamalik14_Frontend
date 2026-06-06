import { GET, POST } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';

export const usersAPI = {
  getAllUsers: (params, signal) => GET(ENDPOINT.USERS.LIST, params, signal),
  getSuspendedUsers: (params, signal) => GET(ENDPOINT.USERS.SUSPENDED_LIST, params, signal),
  suspendUser: (userId, payload, signal) => POST(ENDPOINT.USERS.SUSPEND(userId), payload, signal),
  unsuspendUser: (userId, signal) => POST(ENDPOINT.USERS.UNSUSPEND(userId), {}, signal),
};

export default usersAPI;

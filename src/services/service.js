import axiosInstance from "../service/AxiosInstance";
import { RYI_URL } from "../URL_BE/urlbackend";

//get profile data
export const getProfile = () => {
  return axiosInstance.get(`${RYI_URL}/Account/my-profile`);
};

// handle logout
export const logout = () => {
  return axiosInstance.post(`${RYI_URL}/Auth/logout`);
};

//Admin
export const getUsersAdmin = (PageIndex, PageSize, Search = "") => {
  return axiosInstance.get(
    `${RYI_URL}/Admin/users?PageSize=${PageSize}&Search=${Search}&PageIndex=${PageIndex}&IsDesc=true&OrderBy=createdDate`
  );
};

export const getMentorsAdmin = (PageIndex, PageSize, Search = "") => {
  return axiosInstance.get(
    `${RYI_URL}/Admin/mentors?PageSize=${PageSize}&Search=${Search}&PageIndex=${PageIndex}&IsDesc=true&OrderBy=createdDate`
  );
};

export const getTransactionAdmin = (PageIndex, PageSize, Search = "") => {
  return axiosInstance.get(
    `${RYI_URL}/Admin/transactions?PageSize=${PageSize}&Search=${Search}&PageIndex=${PageIndex}&IsDesc=true&OrderBy=createdDate`
  );
};

export const getStaffsAdmin = (PageIndex, pageSize, Search = "") => {
  return axiosInstance.get(
    `${RYI_URL}/Admin/staffs?PageSize=${pageSize}&Search=${Search}&PageIndex=${PageIndex}&IsDesc=true&OrderBy=createdDate`
  );
};

export const fetchAPIMyProfile = () => {
  return axiosInstance.get(`${RYI_URL}/Account/my-profile`);
};

//notification
export const getUnreadNoti = () => {
  return axiosInstance.get(`${RYI_URL}/Notifications/unread-notification`);
};

export const updateReadNoti = () => {
  return axiosInstance.put(`${RYI_URL}/Notifications/read-notification`);
};

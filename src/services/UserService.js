import axios from "axios";

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/sign-in`, data);
    console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
    return res.data;
};

export const signupUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/sign-up`, data);
    return res.data;
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/api/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/api/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const deleteUser = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/api/user/delete-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

// export const refreshToken = async () => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/refresh-token`, {}, {
//         withCredentials: true
//     })

//     return res.data;
// }

export const refreshToken = async (refreshToken) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/refresh-token`, {}, {
        headers: {
            token: `Bearer ${refreshToken}`,
        }
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/log-out`)
    return res.data;
}

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/api/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`/api/user/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data;
}
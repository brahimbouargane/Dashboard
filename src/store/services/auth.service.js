/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import axios from 'axios';
const API = process.env.REACT_APP_BASE_URL;

const login = async (email, password) => {
    const response = await axios.post(`${API}login`, {
        email,
        password
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = async () => {
    const token = localStorage.getItem('token');
    await axios
        .post(
            `${API}logout`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        })
        .catch((error) => {
            console.log(error);
        });
};

const authService = {
    login,
    logout
};

export default authService;

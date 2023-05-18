import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const Error = Loadable(lazy(() => import('pages/authentication/Error')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: 'login',
            element: <AuthLogin />
        },
        { path: '404', element: <Error /> },
        { path: '*', element: <Navigate to="/404" /> }
        // {
        //     path: 'register',
        //     element: <AuthRegister />
        // }
    ]
};

export default LoginRoutes;

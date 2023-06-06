import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router-dom';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Userslist = Loadable(lazy(() => import('pages/components-overview/users/List')));
const Calendar = Loadable(lazy(() => import('pages/components-overview/Calendar')));
const Vehicules = Loadable(lazy(() => import('pages/components-overview/vehicules')));
const Societes = Loadable(lazy(() => import('pages/components-overview/societes')));
const Contrats = Loadable(lazy(() => import('pages/components-overview/contrats')));
const Examens = Loadable(lazy(() => import('pages/components-overview/examens')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'users',
            element: <Userslist />
        },
        {
            path: 'vehicules',
            element: <Vehicules />
        },
        {
            path: 'societes',
            element: <Societes />
        },
        {
            path: 'contrats',
            element: <Contrats />
        },
        {
            path: 'examens',
            element: <Examens />
        },
        {
            path: 'interventions',
            element: <Calendar />
        },

        // {
        //     path: 'dashboard',
        //     children: [
        //         {
        //             path: 'default',
        //             element: <DashboardDefault />
        //         }
        //     ]
        // },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'shadow',
            element: <Shadow />
        },
        {
            path: 'typography',
            element: <Typography />
        },
        {
            path: 'icons/ant',
            element: <AntIcons />
        },
        {
            path: 'color',
            element: <Color />
        },

        { path: '*', element: <Navigate to="/404" /> }
    ]
};

export default MainRoutes;

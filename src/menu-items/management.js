// assets
import { MedicineBoxOutlined, UserSwitchOutlined, ShopOutlined, CalendarOutlined } from '@ant-design/icons';

// constant
const icons = {
    MedicineBoxOutlined,
    UserSwitchOutlined,
    ShopOutlined,
    CalendarOutlined
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const managemment = {
    id: 'management',
    title: 'Management',
    type: 'group',
    children: [
        {
            id: 'users',
            title: 'Users',
            type: 'collapse',
            icon: icons.UserSwitchOutlined,
            children: [
                {
                    id: 'users-list',
                    title: 'List',
                    type: 'item',
                    url: '/users/list'
                }
            ]
        },
        {
            id: 'devices',
            title: 'Medical Devices',
            type: 'collapse',
            icon: icons.MedicineBoxOutlined,
            children: [
                {
                    id: 'devices-list',
                    title: 'List',
                    type: 'item'
                }
            ]
        },
        {
            id: 'ecommerce',
            title: 'Ecommerce',
            type: 'collapse',
            icon: icons.ShopOutlined,
            children: [
                {
                    id: 'orders',
                    title: 'Orders',
                    type: 'item'
                },
                {
                    id: 'products',
                    title: 'Products',
                    type: 'item'
                },
                {
                    id: 'stock',
                    title: 'Stock',
                    type: 'item'
                }
            ]
        },
        {
            id: 'calendar',
            title: 'Calendar',
            type: 'item',
            url: '/calendar',
            icon: icons.CalendarOutlined,
            breadcrumbs: false
        }
    ]
};

export default managemment;

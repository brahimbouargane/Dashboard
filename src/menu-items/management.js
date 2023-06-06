// assets
import {
    MedicineBoxOutlined,
    UserSwitchOutlined,
    ShopOutlined,
    CalendarOutlined,
    BuildOutlined,
    CarOutlined,
    ContactsOutlined,
    QuestionCircleOutlined,
    FileDoneOutlined,
    FilePptOutlined,
    SettingOutlined
} from '@ant-design/icons';

// constant
const icons = {
    MedicineBoxOutlined,
    UserSwitchOutlined,
    ShopOutlined,
    CalendarOutlined,
    BuildOutlined,
    CarOutlined,
    ContactsOutlined,
    QuestionCircleOutlined,
    FileDoneOutlined,
    SettingOutlined,
    FilePptOutlined
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
            type: 'item',
            icon: icons.UserSwitchOutlined,
            url: '/users'
        },
        {
            id: 'vehicules',
            title: 'Vehicules',
            type: 'item',
            icon: icons.CarOutlined,
            url: '/vehicules'
        },
        {
            id: 'societes',
            title: 'Societes',
            type: 'item',
            icon: icons.BuildOutlined,
            url: '/societes'
        },
        {
            id: 'interventions',
            title: 'Interventions',
            type: 'item',
            url: '/interventions',
            icon: icons.CalendarOutlined
        },
        {
            id: 'contrats',
            title: 'Contrats',
            type: 'item',
            url: '/contrats',
            icon: icons.ContactsOutlined
        },
        {
            id: 'examens',
            title: 'Examens',
            type: 'item',
            url: '/examens',
            icon: icons.FileDoneOutlined
        }
    ]
};

export default managemment;

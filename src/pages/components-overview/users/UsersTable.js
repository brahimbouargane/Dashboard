import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// images
import user1 from '../../../assets/images/users/avatar-1.png';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Divider,
    Select,
    MenuItem,
    Grid,
    Avatar,
    Link,
    Stack,
    Table,
    FormControl,
    FormHelperText,
    TableBody,
    TableCell,
    TableContainer,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Fab,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Checkbox,
    TextField,
    Button,
    Modal,
    Autocomplete,
    Input,
    Dialog,
    DialogContentText,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import Dot from 'components/@extended/Dot';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetchUsers, deleteUser, insertUser, editUser } from '../../../store/reducers/usersSlice';

// Ant Design Icon
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    PlusOutlined,
    CameraFilled,
    CloseCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';

function createData(id, avatar, name, email, password, telephone, role, actions) {
    return { id, avatar, name, email, password, telephone, role, actions };
}

// const rows = [
//     createData(1, user1, 'Camera Lens', 'ex@gmail.com', '+2126678890', 2),
//     createData(2, user1, 'Laptop', 'ex@gmail.com', '+2126678890', 0),
//     createData(3, user1, 'Mobile', 'ex@gmail.com', '+2126678890', 1),
//     createData(4, user1, 'Handset', 'ex@gmail.com', '+2126678890', 1),
//     createData(5, user1, 'Computer Accessories', 'ex@gmail.com', '+2126678890', 1),
//     createData(6, user1, 'TV', 'ex@gmail.com', '+2126678890', 0),
//     createData(7, user1, 'Keyboard', 'ex@gmail.com', '+2126678890', 2),
//     createData(8, user1, 'Mouse', 'ex@gmail.com', '+2126678890', 2),
//     createData(9, user1, 'Desktop', 'ex@gmail.com', '+2126678890', 1),
//     createData(10, user1, 'Chair', 'ex@gmail.com', '+2126678890', 0)
// ];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
// ==============================|| STYLED COMPONENTS ||============================== //

const DeleteIcon = styled.a`
    padding: 1px 3px;
    border-radius: 4px;
    &:hover {
    background-color: #ffcdd2
    ;
`;
const EditIcon = styled.a`
    padding: 1px 3px;
    border-radius: 4px;
    &:hover {
    background-color: #bbdefb
    ;
`;

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    // {
    //     id: 'id',
    //     align: 'left',
    //     disablePadding: false,
    //     label: '#'
    // },
    {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'USER NAME'
    },
    {
        id: 'email',
        align: 'left',
        disablePadding: false,
        label: 'EMAIL'
    },
    {
        id: 'telephone',
        align: 'left',
        disablePadding: false,
        label: 'CONTACT'
    },
    {
        id: 'role',
        align: 'left',
        disablePadding: false,
        label: 'ROLE'
    },
    {
        id: 'actions',
        align: 'left',
        disablePadding: false,
        label: 'ACTIONS'
    }
];

// ==============================|| ADD USER MODAL & HEAD TABLE - HEADER ||============================== //

function FilterTableHeader({ open, handleOpen, handleClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '3px'
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 24px 0px',
                marginBottom: '15px'
            }}
        >
            <TextField
                placeholder="Search"
                id="outlined-start-adornment"
                InputProps={{
                    startAdornment: <SearchOutlined />
                }}
            />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen}>
                Add User
            </Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            telephone: '',
                            password: '',
                            role: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().max(30).required('First Name is required'),
                            telephone: Yup.string()
                                .matches(phoneRegExp, 'Phone number is not valid')
                                .required('Phone number is required')
                                .min(10)
                                .max(10),
                            // .test('len', 'Must be exactly 10 characters', (val) => val.length === 10),
                            password: Yup.string()
                                .min(8, 'Must be greater than 8 characters')
                                .max(16, 'must be smaller than 16 characters')
                                .required('Password is required'),
                            email: Yup.string().email('Must be a valid email').required('Email is required'),
                            role: Yup.string().ensure().required('Role is required!')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            // try {
                            //     setStatus({ success: false });
                            //     setSubmitting(false);
                            // } catch (err) {
                            //     console.error(err);
                            //     setStatus({ success: false });
                            //     setErrors({ submit: err.message });
                            //     setSubmitting(false);
                            // }
                            dispatch(
                                insertUser({
                                    name: values.name,
                                    email: values.email,
                                    telephone: values.telephone,
                                    password: values.password,
                                    role_id: values.role
                                })
                            )
                                .unwrap()
                                .then(() => {
                                    dispatch(fetchUsers());
                                    navigate('/users/list');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h4" sx={{ padding: '25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                    Add User
                                </Typography>
                                <Grid container spacing={3} sx={{ padding: '10px 20px' }}>
                                    {/* <Grid item xs={4} md={6} sx={{ display: 'grid', justifyItems: 'center' }}>
                                        <IconButton
                                            color="primary"
                                            aria-label="upload picture"
                                            component="label"
                                            sx={{ background: '#69c0ff', padding: '50px', borderRadius: '50%' }}
                                        >
                                            <input hidden accept="image/*" type="file" />
                                            <CameraFilled />
                                        </IconButton>
                                    </Grid> */}
                                    <Grid item xs={12}>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="user-signup">Name*</InputLabel>
                                                <OutlinedInput
                                                    id="user-login"
                                                    type="name"
                                                    value={values.name}
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Name"
                                                    fullWidth
                                                    error={Boolean(touched.name && errors.name)}
                                                />
                                                {touched.name && errors.name && (
                                                    <FormHelperText error id="helper-text-name-signup">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="telephone-signup">Phone Number*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.telephone && errors.telephone)}
                                                    // id="telephone-signup"
                                                    type="telephone"
                                                    value={values.telephone}
                                                    name="telephone"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Phone number"
                                                    inputProps={{}}
                                                />
                                                {touched.telephone && errors.telephone && (
                                                    <FormHelperText error id="helper-text-telephone-signup">
                                                        {errors.telephone}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="email-signup">Email*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.email && errors.email)}
                                                    id="email"
                                                    type="email"
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="email@email.com"
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email-signup">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="password-login">Password*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.password && errors.password)}
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter password"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                                {touched.password && errors.password && (
                                                    <FormHelperText error id="helper-text-password-signup">
                                                        {errors.password}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="role-signup">role*</InputLabel>

                                                <FormControl>
                                                    <Select
                                                        fullWidth
                                                        error={Boolean(touched.role && errors.role)}
                                                        id="role"
                                                        value={values.role}
                                                        name="role"
                                                        required
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="" sx={{ color: 'text.secondary' }}>
                                                            Select role
                                                        </MenuItem>
                                                        <MenuItem value="1">Admin</MenuItem>
                                                        <MenuItem value="2">Viewer</MenuItem>
                                                        <MenuItem value="3">Editor</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {touched.role && errors.role && (
                                                    <FormHelperText error id="helper-text-role-signup">
                                                        {errors.role}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0px' }}>
                                        <Button color="error" onClick={handleClose} sx={{ marginRight: '10px' }}>
                                            Disagree
                                        </Button>
                                        <Button variant="contained" type="submit" onClick={handleClose}>
                                            Agree
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </Box>
    );
}
FilterTableHeader.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};

// ==============================|| ORDER TABLE - HEADER ||============================== //
function DeleteModal({ open, handleOpen, handleClose }) {
    return (
        <Dialog open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 2 }}>
                <DialogContent>
                    <Box
                        component="span"
                        color="error"
                        sx={{ fontSize: 'xxx-large', display: 'flex', marginBottom: '20px', color: '#ff4d4f', justifyContent: 'center' }}
                    >
                        <CloseCircleOutlined />
                    </Box>

                    <DialogContentText id="alert-dialog-description" variant="h4" color="#000">
                        Are you sure ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Disagree
                    </Button>
                    <Button variant="contained" onClick={handleClose}>
                        Agree
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
DeleteModal.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};

function OrderTableHead({ order, orderBy, onSelectAllClick }) {
    return (
        <TableHead
            sx={{
                display: 'table-header-group',
                backgroundColor: 'rgb(250, 250, 250)',
                borderTop: '1px solid rgb(240, 240, 240)',
                borderBottom: '2px solid rgb(240, 240, 240)'
            }}
        >
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        sx={{ paddingY: '0px' }}
                        color="primary"
                        // indeterminate={numSelected > 0 && numSelected < rowCount}
                        // checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string,
    onSelectAllClick: PropTypes.func.isRequired
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    const theme = useTheme();
    let color;
    let title;
    let backgroundcolor;

    switch (status) {
        case 1:
            color = theme.palette.error.main;
            title = 'Admin';
            backgroundcolor = theme.palette.error.lighter;
            break;
        case 2:
            color = theme.palette.warning.main;
            title = 'Editor';
            backgroundcolor = theme.palette.warning.lighter;
            break;
        case 3:
            color = theme.palette.primary.main;
            title = 'Viewer';
            backgroundcolor = theme.palette.primary.lighter;
            break;
        default:
            color = theme.palette.primary.main;
            title = 'None';
            backgroundcolor = theme.palette.primary.lighter;
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {/* <Dot color={color} /> */}
            <Typography sx={{ px: 2, py: 0.5, borderRadius: '16px' }} color={color} backgroundColor={backgroundcolor}>
                {title}
            </Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function Userslist() {
    const [order] = useState('asc');
    const [orderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const dispatch = useDispatch();
    const { records, loading, error } = useSelector((state) => state.users);

    const deleteRecord = useCallback((id) => dispatch(deleteUser(id)), [dispatch]);
    const record = records;

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(!open);
    const handleOpenDelete = () => setOpenDelete(!openDelete);
    const handleCloseDelete = () => setOpenDelete(!openDelete);
    const theme = useTheme();

    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            // const newSelected = rows.map((n) => n.name);
            // setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <FilterTableHeader open={open} handleOpen={handleOpen} handleClose={handleClose} />
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 3
                        }
                    }}
                >
                    <OrderTableHead order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} />
                    <DeleteModal open={openDelete} handleOpen={handleOpenDelete} handleClose={handleCloseDelete} />
                    <TableBody>
                        {records.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    {/* <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {index}
                                        </Link>
                                    </TableCell> */}
                                    <TableCell align="left">
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Box>
                                                <Avatar src={user1} alt="user1" />
                                            </Box>
                                            <Box sx={{ ml: 1 }}>{row.name}</Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.telephone}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.role_id} />
                                    </TableCell>
                                    <TableCell sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', padding: '23px' }}>
                                        <EditIcon>
                                            <EditOutlined
                                                style={{ color: theme.palette.primary.main, cursor: 'pointer', fontSize: '15px' }}
                                            />
                                        </EditIcon>
                                        <DeleteIcon onClick={handleOpenDelete}>
                                            <DeleteOutlined
                                                style={{ color: theme.palette.error.main, cursor: 'pointer', fontSize: '15px' }}
                                            />
                                        </DeleteIcon>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {/* {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Box>
                                                <Avatar src={row.avatar} alt="user1" />
                                            </Box>
                                            <Box sx={{ ml: 1 }}>{row.name}</Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.contact}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.role} />
                                    </TableCell>
                                    <TableCell sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', padding: '23px' }}>
                                        <EditIcon>
                                            <EditOutlined
                                                style={{ color: theme.palette.primary.main, cursor: 'pointer', fontSize: '15px' }}
                                            />
                                        </EditIcon>
                                        <DeleteIcon onClick={handleOpenDelete}>
                                            <DeleteOutlined
                                                style={{ color: theme.palette.error.main, cursor: 'pointer', fontSize: '15px' }}
                                            />
                                        </DeleteIcon>
                                    </TableCell>
                                </TableRow>
                            );
                        })} */}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

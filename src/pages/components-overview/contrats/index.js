import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// images
import user1 from '../../../assets/images/users/avatar-1.png';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Pagination,
    Divider,
    Select,
    TablePagination,
    MenuItem,
    TableFooter,
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
import { fetchContrats, deleteContrat, insertContrat, editContrat } from '../../../store/reducers/contratsSlice';

// Ant Design Icon
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    PlusOutlined,
    CameraFilled,
    CloseCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CloseOutlined
} from '@ant-design/icons';

function createData(id, ref, societeid, vehiculeid, interventionchaque, datedebut, datefin, statusid, actions) {
    return { id, ref, societeid, vehiculeid, interventionchaque, datedebut, datefin, statusid, actions };
}

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
        id: 'ref',
        align: 'left',
        disablePadding: false,
        label: 'REFERENCE'
    },
    {
        id: 'societeid',
        align: 'left',
        disablePadding: false,
        label: 'SOCIETE'
    },
    {
        id: 'vehiculeid',
        align: 'left',
        disablePadding: false,
        label: 'VEHICULE'
    },
    {
        id: 'intervention_chaque',
        align: 'left',
        disablePadding: false,
        label: 'INTERVENTION'
    },
    {
        id: 'datedebut',
        align: 'left',
        disablePadding: false,
        label: 'DATE DEBUT'
    },
    {
        id: 'datefin',
        align: 'left',
        disablePadding: false,
        label: 'DATE FIN'
    },
    {
        id: 'statusid',
        align: 'left',
        disablePadding: false,
        label: 'STATUS'
    },
    {
        id: 'actions',
        align: 'left',
        disablePadding: false,
        label: 'ACTIONS'
    }
];

// ==============================|| ADD USER MODAL & HEAD TABLE - HEADER ||============================== //

function FilterTableHeader() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const handleOpen = () => setOpen(!open);
    const handleClose = () => {
        setOpen(!open);
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
                Add Contrat
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
                            ref: '',
                            societe_id: '',
                            vehicule_id: '',
                            intervention_chaque: '',
                            date_debut: '',
                            date_fin: '',
                            status_id: '',
                            submit: null
                        }}
                        // validationSchema={Yup.object().shape({
                        //     name: Yup.string().max(30).required('First Name is required'),
                        //     telephone: Yup.string()
                        //         .matches(phoneRegExp, 'Phone number is not valid')
                        //         .required('Phone number is required')
                        //         .min(10)
                        //         .max(10),
                        //     // .test('len', 'Must be exactly 10 characters', (val) => val.length === 10),
                        //     password: Yup.string()
                        //         .min(8, 'Must be greater than 8 characters')
                        //         .max(16, 'must be smaller than 16 characters')
                        //         .required('Password is required'),
                        //     email: Yup.string().email('Must be a valid email').required('Email is required'),
                        //     role: Yup.string().ensure().required('Role is required!')
                        // })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            dispatch(
                                insertContrat({
                                    ref: values.ref,
                                    societe_id: values.societe_id,
                                    vehicule_id: values.vehicule_id,
                                    intervention_chaque: values.intervention_chaque,
                                    date_debut: values.date_debut,
                                    date_fin: values.date_fin,
                                    status_id: values.status_id
                                })
                            )
                                .unwrap()
                                .then(() => {
                                    dispatch(fetchContrats());
                                    navigate('/contrats');
                                    handleClose();
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, handleReset, touched, values, resetForm }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h4" sx={{ padding: '25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                    Add Contrat
                                </Typography>

                                <Grid container spacing={3} sx={{ padding: '10px 20px' }}>
                                    <Grid item={true} xs={12}>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="ref">Ref*</InputLabel>
                                                <OutlinedInput
                                                    id="ref"
                                                    type="text"
                                                    value={values.ref}
                                                    name="ref"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="ref"
                                                    fullWidth
                                                    // error={Boolean(touched.name && errors.name)}
                                                />
                                                {/* {touched.name && errors.name && (
                                                    <FormHelperText error id="helper-text-name">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="societe_id">societe_id*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="societe_id"
                                                    type="number"
                                                    value={values.societe_id}
                                                    name="societe_id"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="societe id"
                                                    inputProps={{}}
                                                    // error={Boolean(touched.telephone && errors.telephone)}
                                                />
                                                {/* {touched.telephone && errors.telephone && (
                                                    <FormHelperText error id="helper-text-telephone">
                                                        {errors.telephone}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="vehicule_id">vehicule id*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.email && errors.email)}
                                                    id="vehicule_id"
                                                    type="number"
                                                    value={values.vehicule_id}
                                                    name="vehicule_id"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="vehicule_id"
                                                    inputProps={{}}
                                                />
                                                {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="intervention_chaque">intervention chaque*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.email && errors.email)}
                                                    id="intervention_chaque"
                                                    type="number"
                                                    value={values.intervention_chaque}
                                                    name="intervention_chaque"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="intervention_chaque"
                                                    inputProps={{}}
                                                />
                                                {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="date_debut">date debut*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.email && errors.email)}
                                                    id="date_debut"
                                                    type="date"
                                                    value={values.date_debut}
                                                    name="date_debut"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="date_debut"
                                                    inputProps={{}}
                                                />
                                                {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="date_fin">date fin*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.email && errors.email)}
                                                    id="date_fin"
                                                    type="date"
                                                    value={values.date_fin}
                                                    name="date_fin"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="date_fin"
                                                    inputProps={{}}
                                                />
                                                {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="status_id">status id*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.email && errors.email)}
                                                    id="status_id"
                                                    type="number"
                                                    value={values.status_id}
                                                    name="status_id"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="status_id"
                                                    inputProps={{}}
                                                />
                                                {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                            </Stack>
                                        </Grid>
                                        {errors.submit && (
                                            <Grid item xs={12}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0px' }}>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    handleReset();
                                                    handleClose();
                                                    resetForm();
                                                }}
                                                sx={{ marginRight: '10px' }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button variant="contained" type="submit">
                                                Add Contrat
                                            </Button>
                                        </Grid>
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
// FilterTableHeader.propTypes = {
//     open: PropTypes.bool,
//     handleOpen: PropTypes.func.isRequired,
//     handleClose: PropTypes.func.isRequired
// };
// ==============================|| EDIT ||============================== //
function EditContrat({ open, handleClose, handleOpen, handleEdit, editItem }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { records, loading, error } = useSelector((state) => state.contrats);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
        <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Formik
                    enableReinitialize={true}
                    initialValues={editItem}
                    // validationSchema={Yup.object().shape({
                    //     name: Yup.string().max(30).required('First Name is required'),
                    //     telephone: Yup.string()
                    //         .matches(phoneRegExp, 'Phone number is not valid')
                    //         .required('Phone number is required')
                    //         .min(10)
                    //         .max(10),
                    //     email: Yup.string().email('Must be a valid email').required('Email is required'),
                    //     role: Yup.string().ensure().required('Role is required!')
                    // })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        dispatch(
                            editContrat({
                                id: values.id,
                                ref: values.ref,
                                societe_id: values.societe_id,
                                vehicule_id: values.vehicule_id,
                                intervention_chaque: values.intervention_chaque,
                                date_debut: values.date_debut,
                                date_fin: values.date_fin,
                                status_id: values.status_id
                            })
                        )
                            .unwrap()
                            .then(() => {
                                dispatch(fetchContrats());
                                navigate('/contrats');
                                handleClose();
                            });
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, handleReset, touched, values, resetForm }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Typography variant="h4" sx={{ padding: '25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                Edit Contrat
                            </Typography>
                            <Grid container spacing={3} sx={{ padding: '10px 20px' }}>
                                <Grid item={true} xs={12}>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="ref">Ref*</InputLabel>
                                            <OutlinedInput
                                                id="ref"
                                                type="text"
                                                value={values.ref}
                                                name="ref"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="ref"
                                                fullWidth
                                                // error={Boolean(touched.name && errors.name)}
                                            />
                                            {/* {touched.name && errors.name && (
                                                    <FormHelperText error id="helper-text-name">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="societe_id">societe_id*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                id="societe_id"
                                                type="number"
                                                value={values.societe_id}
                                                name="societe_id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="societe id"
                                                inputProps={{}}
                                                // error={Boolean(touched.telephone && errors.telephone)}
                                            />
                                            {/* {touched.telephone && errors.telephone && (
                                                    <FormHelperText error id="helper-text-telephone">
                                                        {errors.telephone}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="vehicule_id">vehicule id*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.email && errors.email)}
                                                id="vehicule_id"
                                                type="number"
                                                value={values.vehicule_id}
                                                name="vehicule_id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="vehicule_id"
                                                inputProps={{}}
                                            />
                                            {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="intervention_chaque">intervention chaque*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.email && errors.email)}
                                                id="intervention_chaque"
                                                type="number"
                                                value={values.intervention_chaque}
                                                name="intervention_chaque"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="intervention_chaque"
                                                inputProps={{}}
                                            />
                                            {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="date_debut">date debut*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.email && errors.email)}
                                                id="date_debut"
                                                type="date"
                                                value={values.date_debut}
                                                name="date_debut"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="date_debut"
                                                inputProps={{}}
                                            />
                                            {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="date_fin">date fin*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.email && errors.email)}
                                                id="date_fin"
                                                type="date"
                                                value={values.date_fin}
                                                name="date_fin"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="date_fin"
                                                inputProps={{}}
                                            />
                                            {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="status_id">status id*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.email && errors.email)}
                                                id="status_id"
                                                type="number"
                                                value={values.status_id}
                                                name="status_id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="status_id"
                                                inputProps={{}}
                                            />
                                            {/* {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )} */}
                                        </Stack>
                                    </Grid>
                                </Grid>

                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0px' }}>
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            handleReset();
                                            handleClose();
                                            resetForm();
                                        }}
                                        sx={{ marginRight: '10px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Edit Contrat
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
}

// ==============================|| ORDER TABLE - HEADER ||============================== //
function DeleteModal({ open, handleOpen, handleClose, handleDelete }) {
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
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleDelete}>
                        Delete Contrat
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

export default function Contratslist() {
    const { records, loading, error } = useSelector((state) => state.contrats);
    const rows = records;

    const [order] = useState('asc');
    const [orderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState();
    const [rowsLength, setRowsLength] = useState(rows.length);
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editItem, setEditItem] = useState({
        id: '',
        ref: '',
        societe_id: '',
        vehicule_id: '',
        intervention_chaque: '',
        date_debut: '',
        date_fin: '',
        status_id: '',
        submit: null
    });
    const dispatch = useDispatch();
    const theme = useTheme();

    const InitialRows = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [page, rowsPerPage]);
    const [visibleRows, setvisibleRows] = useState(InitialRows);
    useMemo(() => setvisibleRows(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)), [page, rowsPerPage, records]);

    const deleteRecord = useCallback((id) => dispatch(deleteContrat(id)), [dispatch]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        dispatch(fetchContrats());
    }, [dispatch]);

    const OpenEdit = () => setOpenEdit(!openEdit);
    const closeEdit = () => setOpenEdit(!openEdit);
    const editHandler = (item) => {
        setEditItem(item);
        OpenEdit();
    };
    const handleEdit = () => {
        // editRecord(editItem);
        closeEdit();
        setEditItem();
    };
    const OpenDelete = () => setOpenDelete(!openDelete);
    const closeDelete = () => setOpenDelete(!openDelete);
    const handleDelete = () => {
        deleteRecord(deletedItem);
        closeDelete();
        setDeletedItem();
    };
    const deleteHandler = (item) => {
        setDeletedItem(item.id);
        OpenDelete();
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            // const newSelected = rows.map((n) => n.name);
            // setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                {/* <FilterTableHeader open={open} handleOpen={handleOpen} handleClose={handleClose} /> */}
                <FilterTableHeader />
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
                    <DeleteModal open={openDelete} handleOpen={OpenDelete} handleClose={closeDelete} handleDelete={handleDelete} />
                    <EditContrat
                        open={openEdit}
                        handleOpen={OpenEdit}
                        handleClose={closeEdit}
                        handleEdit={handleEdit}
                        editItem={editItem}
                    />
                    <TableBody>
                        {visibleRows.map((row, index) => {
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
                                    <TableCell align="left">{row.ref}</TableCell>
                                    <TableCell align="left">{row.societe.societe}</TableCell>
                                    <TableCell align="left">{row.vehicule.matricule}</TableCell>
                                    <TableCell align="left">{row.intervention_chaque}</TableCell>
                                    <TableCell align="left">{row.date_debut}</TableCell>
                                    <TableCell align="left">{row.date_fin}</TableCell>
                                    <TableCell align="left">{row.status_id}</TableCell>
                                    <TableCell sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', padding: '23px' }}>
                                        <EditIcon style={{ cursor: 'pointer' }} onClick={() => editHandler(row)}>
                                            <EditOutlined style={{ color: theme.palette.info.main, cursor: 'pointer', fontSize: '15px' }} />
                                        </EditIcon>
                                        <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteHandler(row)}>
                                            <DeleteOutlined style={{ color: theme.palette.error.main, fontSize: '15px' }} />
                                        </DeleteIcon>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{
                    '& .css-1f6ziuf-MuiToolbar-root-MuiTablePagination-toolbar': {
                        paddingRight: '20px',
                        borderTop: '1px solid #e6ebf1'
                    }
                }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}

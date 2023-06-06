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
import { Upload, message } from 'antd';

// third-party
import NumberFormat from 'react-number-format';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import Dot from 'components/@extended/Dot';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetchVehicules, deleteVehicule, insertVehicule, editVehicule } from '../../../store/reducers/vehiculeSlice';

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
    CloseOutlined,
    CameraOutlined,
    LoadingOutlined
} from '@ant-design/icons';

function createData(id, image, matricule, numero_serie, marque, date_circulation, capacite, typevehicule_id, status, actions) {
    return { id, image, matricule, numero_serie, marque, date_circulation, capacite, typevehicule_id, status, actions };
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
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
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
        id: 'image',
        align: 'left',
        disablePadding: false,
        label: 'IMAGE'
    },
    {
        id: 'matricule',
        align: 'left',
        disablePadding: false,
        label: 'MATRICULE'
    },
    {
        id: 'numero_serie',
        align: 'left',
        disablePadding: false,
        label: 'NUMERO SERIE'
    },
    {
        id: 'marque',
        align: 'left',
        disablePadding: false,
        label: 'MARQUE'
    },
    {
        id: 'date_circulation',
        align: 'left',
        disablePadding: false,
        label: 'DATE CIRCULATION'
    },
    {
        id: 'capacite',
        align: 'left',
        disablePadding: false,
        label: 'CAPACITE'
    },
    {
        id: 'typevehicule',
        align: 'left',
        disablePadding: false,
        label: 'TYPE VEHICULE'
    },
    {
        id: 'status',
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

// ==============================|| ADD Vehicules MODAL & HEAD TABLE - HEADER ||============================== //

function FilterTableHeader() {
    const [open, setOpen] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
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
    const handleOpen = () => setOpen(!open);
    const handleClose = () => {
        setOpen(!open);
    };
    const beforeUpload = (file) => {
        return false;
    };
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    // const handleChangee = ({ fileList: newFileList }) => setFileList(newFileList);
    const handleChangee = ({ fileList: newFileList }) => {
        // Loop through each uploaded file
        newFileList.forEach(async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const base64Image = file.preview; // Extract the base64 representation
            setBaseUrl(base64Image); // Log the base64 image to the console
        });

        setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );

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
                Add Vehicule
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
                            image: baseUrl,
                            matricule: '',
                            numero_serie: '',
                            marque: '',
                            date_circulation: '',
                            capacite: '',
                            typevehicule_id: '',
                            status: '',
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
                            dispatch(
                                insertVehicule({
                                    image: baseUrl,
                                    matricule: values.matricule,
                                    numero_serie: values.numero_serie,
                                    marque: values.marque,
                                    date_circulation: values.date_circulation,
                                    capacite: values.capacite,
                                    typevehicule_id: values.typevehicule_id,
                                    status: values.status
                                })
                            )
                                .unwrap()
                                .then(() => {
                                    dispatch(fetchVehicules());
                                    navigate('/vehicules');
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
                                    Add Vehicule
                                </Typography>
                                <Grid container spacing={3} sx={{ padding: '10px 40px', margin: '0px 0px' }}>
                                    <Grid item xs={12} style={{ paddingLeft: '0px' }} md={4}>
                                        <InputLabel>Image*</InputLabel>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            listType="picture-circle"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={handleChangee}
                                            accept=".png, .jpg, .jpeg"
                                        >
                                            {fileList.length ? null : uploadButton}
                                        </Upload>
                                        <Modal open={previewOpen} title={previewTitle} footer={null} onClick={handleCancel}>
                                            <img
                                                alt="example"
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '30%'
                                                }}
                                                src={previewImage}
                                            />
                                        </Modal>
                                    </Grid>
                                    <Grid container spacing={2} xs={12} md={8}>
                                        <Grid item xs={6} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="matricule">Matricule*</InputLabel>
                                                <OutlinedInput
                                                    id="matricule"
                                                    type="text"
                                                    value={values.matricule}
                                                    name="matricule"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="matricule"
                                                    fullWidth
                                                    // error={Boolean(touched.matricule && errors.matricule)}
                                                />
                                                {touched.matricule && errors.matricule && (
                                                    <FormHelperText error id="helper-text-matricule-signup">
                                                        {errors.matricule}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="marque">Marque*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.marque && errors.marque)}
                                                    id="marque"
                                                    type="text"
                                                    value={values.marque}
                                                    name="marque"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="marque"
                                                    inputProps={{}}
                                                />
                                                {touched.marque && errors.marque && (
                                                    <FormHelperText error id="helper-text-marque-signup">
                                                        {errors.marque}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="numero_serie">Numero serie*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.numero_serie && errors.numero_serie)}
                                                    id="numero_serie"
                                                    type="text"
                                                    value={values.numero_serie}
                                                    name="numero_serie"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="numero serie"
                                                    inputProps={{}}
                                                />
                                                {touched.numero_serie && errors.numero_serie && (
                                                    <FormHelperText error id="helper-text-numero_serie-signup">
                                                        {errors.numero_serie}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="date_circulation">Date circulation*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.date_circulation && errors.date_circulation)}
                                                    id="date_circulation"
                                                    type="date"
                                                    value={values.date_circulation}
                                                    name="date_circulation"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="date circulation"
                                                />
                                                {touched.date_circulation && errors.date_circulation && (
                                                    <FormHelperText error id="helper-text-date_circulation-signup">
                                                        {errors.date_circulation}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="capacite">Capacite*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.capacite && errors.capacite)}
                                                    id="capacite"
                                                    type="number"
                                                    value={values.capacite}
                                                    name="capacite"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="date circulation"
                                                />
                                                {touched.capacite && errors.capacite && (
                                                    <FormHelperText error id="helper-text-capacite-signup">
                                                        {errors.capacite}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="capacite">Typevehicule*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    // error={Boolean(touched.typevehicule_id && errors.typevehicule_id)}
                                                    id="typevehicule_id"
                                                    type="number"
                                                    value={values.typevehicule_id}
                                                    name="typevehicule_id"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="date circulation"
                                                />
                                                {touched.typevehicule_id && errors.typevehicule_id && (
                                                    <FormHelperText error id="helper-text-typevehicule_id-signup">
                                                        {errors.typevehicule_id}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="status">Status*</InputLabel>

                                                <FormControl>
                                                    <Select
                                                        fullWidth
                                                        // error={Boolean(touched.status && errors.status)}
                                                        id="status"
                                                        value={values.status}
                                                        name="status"
                                                        required
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="" sx={{ color: 'text.secondary' }}>
                                                            Select status
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
                                            Add Vehicule
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
// FilterTableHeader.propTypes = {
//     open: PropTypes.bool,
//     handleOpen: PropTypes.func.isRequired,
//     handleClose: PropTypes.func.isRequired
// };
// ==============================|| EDIT ||============================== //
function EditVehicule({ open, handleClose, handleOpen, handleEdit, editItem }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const { records, loading, error } = useSelector((state) => state.vehicules);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const beforeUpload = (file) => {
        return false;
    };
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    // const handleChangee = ({ fileList: newFileList }) => setFileList(newFileList);
    const handleChangee = ({ fileList: newFileList }) => {
        // Loop through each uploaded file
        newFileList.forEach(async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const base64Image = file.preview; // Extract the base64 representation
            setBaseUrl(base64Image); // Log the base64 image to the console
        });

        setFileList(newFileList);
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );

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
                    validationSchema={Yup.object().shape({
                        name: Yup.string().max(30).required('First Name is required'),
                        telephone: Yup.string()
                            .matches(phoneRegExp, 'Phone number is not valid')
                            .required('Phone number is required')
                            .min(10)
                            .max(10),
                        email: Yup.string().email('Must be a valid email').required('Email is required'),
                        role: Yup.string().ensure().required('Role is required!')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        dispatch(
                            editVehicule({
                                id: values.id,
                                image: baseUrl,
                                matricule: values.matricule,
                                numero_serie: values.numero_serie,
                                marque: values.marque,
                                date_circulation: values.date_circulation,
                                capacite: values.capacite,
                                typevehicule_id: values.typevehicule_id,
                                status: values.status
                            })
                        )
                            .unwrap()
                            .then(() => {
                                dispatch(fetchVehicules());
                                navigate('/Vehicules');
                                handleClose();
                            });
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, handleReset, touched, values, resetForm }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Typography variant="h4" sx={{ padding: '25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                Edit Vehicule
                            </Typography>
                            <Grid container spacing={3} sx={{ padding: '10px 40px', margin: '0px 0px' }}>
                                <Grid item xs={12} style={{ paddingLeft: '0px' }} md={4}>
                                    <InputLabel>Image*</InputLabel>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        listType="picture-circle"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChangee}
                                        value={values.image}
                                        accept=".png, .jpg, .jpeg"
                                    >
                                        {fileList.length ? null : uploadButton}
                                    </Upload>
                                    <Modal open={previewOpen} title={previewTitle} footer={null} onClick={handleCancel}>
                                        <img
                                            alt="example"
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '30%'
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </Grid>
                                <Grid container spacing={2} xs={12} md={8}>
                                    <Grid item xs={6} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="matricule">Matricule*</InputLabel>
                                            <OutlinedInput
                                                id="matricule"
                                                type="text"
                                                value={values.matricule}
                                                name="matricule"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="matricule"
                                                fullWidth
                                                // error={Boolean(touched.matricule && errors.matricule)}
                                            />
                                            {touched.matricule && errors.matricule && (
                                                <FormHelperText error id="helper-text-matricule-signup">
                                                    {errors.matricule}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="marque">Marque*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.marque && errors.marque)}
                                                id="marque"
                                                type="text"
                                                value={values.marque}
                                                name="marque"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="marque"
                                                inputProps={{}}
                                            />
                                            {touched.marque && errors.marque && (
                                                <FormHelperText error id="helper-text-marque-signup">
                                                    {errors.marque}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="numero_serie">Numero serie*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.numero_serie && errors.numero_serie)}
                                                id="numero_serie"
                                                type="text"
                                                value={values.numero_serie}
                                                name="numero_serie"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="numero serie"
                                                inputProps={{}}
                                            />
                                            {touched.numero_serie && errors.numero_serie && (
                                                <FormHelperText error id="helper-text-numero_serie-signup">
                                                    {errors.numero_serie}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="date_circulation">Date circulation*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.date_circulation && errors.date_circulation)}
                                                id="date_circulation"
                                                type="date"
                                                value={values.date_circulation}
                                                name="date_circulation"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="date circulation"
                                            />
                                            {touched.date_circulation && errors.date_circulation && (
                                                <FormHelperText error id="helper-text-date_circulation-signup">
                                                    {errors.date_circulation}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="capacite">Capacite*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.capacite && errors.capacite)}
                                                id="capacite"
                                                type="number"
                                                value={values.capacite}
                                                name="capacite"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="date circulation"
                                            />
                                            {touched.capacite && errors.capacite && (
                                                <FormHelperText error id="helper-text-capacite-signup">
                                                    {errors.capacite}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="capacite">Typevehicule*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                // error={Boolean(touched.typevehicule_id && errors.typevehicule_id)}
                                                id="typevehicule_id"
                                                type="number"
                                                value={values.typevehicule_id}
                                                name="typevehicule_id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="date circulation"
                                            />
                                            {touched.typevehicule_id && errors.typevehicule_id && (
                                                <FormHelperText error id="helper-text-typevehicule_id-signup">
                                                    {errors.typevehicule_id}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="status">Status*</InputLabel>

                                            <FormControl>
                                                <Select
                                                    fullWidth
                                                    // error={Boolean(touched.status && errors.status)}
                                                    id="status"
                                                    value={values.status}
                                                    name="status"
                                                    required
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value="" sx={{ color: 'text.secondary' }}>
                                                        Select status
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
                                        Edit Vehicule
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
                        Delete Vehicule
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

export default function Vehiculeslist() {
    const { records, loading, error } = useSelector((state) => state.vehicules);
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
    const [editItem, setEditItem] = useState({ id: '', name: '', email: '', telephone: '', password: '', role_id: '', submit: null });
    const dispatch = useDispatch();
    const theme = useTheme();

    const InitialRows = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [page, rowsPerPage]);
    const [visibleRows, setvisibleRows] = useState(InitialRows);
    useMemo(() => setvisibleRows(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)), [page, rowsPerPage, records]);

    const deleteRecord = useCallback((id) => dispatch(deleteVehicule(id)), [dispatch]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        dispatch(fetchVehicules());
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
                    <EditVehicule
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
                                    <TableCell align="left">
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Box>
                                                <Avatar src={user1} alt="user1" />
                                            </Box>
                                            <Box sx={{ ml: 1 }}>{row.name}</Box> */}
                                            <Avatar src={row.image} alt="ii" />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{row.matricule}</TableCell>
                                    <TableCell align="left">{row.numero_serie}</TableCell>
                                    <TableCell align="left">{row.marque}</TableCell>
                                    <TableCell align="left">{row.date_circulation}</TableCell>
                                    <TableCell align="left">{row.capacite}</TableCell>
                                    <TableCell align="left">{row.typevehicule_id}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.status} />
                                    </TableCell>
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

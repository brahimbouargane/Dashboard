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
import { fetchSocietes, deleteSociete, insertSociete, editSociete } from '../../../store/reducers/societeSlice';

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

function createData(id, logo, societe, email, responsable, adresse, telephone, fix, actions) {
    return { id, logo, societe, email, responsable, adresse, telephone, fix, actions };
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
        id: 'logo',
        align: 'left',
        disablePadding: false,
        label: 'LOGO'
    },
    {
        id: 'societe',
        align: 'left',
        disablePadding: false,
        label: 'SOCIETE'
    },
    {
        id: 'email',
        align: 'left',
        disablePadding: false,
        label: 'EMAIL'
    },
    {
        id: 'responsable',
        align: 'left',
        disablePadding: false,
        label: 'RESPONSABLE'
    },
    {
        id: 'adresse',
        align: 'left',
        disablePadding: false,
        label: 'ADRESSE'
    },
    {
        id: 'telephone',
        align: 'left',
        disablePadding: false,
        label: 'TELEPHONE'
    },
    {
        id: 'fix',
        align: 'left',
        disablePadding: false,
        label: 'FIX'
    },
    {
        id: 'actions',
        align: 'left',
        disablePadding: false,
        label: 'ACTIONS'
    }
];

// ==============================|| ADD societes MODAL & HEAD TABLE - HEADER ||============================== //

function FilterTableHeader() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
    const handleChangee = (newFileList, setFieldValue) => {
        // Loop through each uploaded file
        newFileList.forEach(async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const base64Image = file.preview; // Extract the base64 representation
            setFieldValue('logo', base64Image);
            setBaseUrl(base64Image); // Log the base64 image to the console
        });

        setFileList(newFileList);
    };
    useEffect(() => {}, [baseUrl]);

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
                Add Societe
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
                            logo: baseUrl,
                            societe: '',
                            email: '',
                            responsable: '',
                            adresse: '',
                            telephone: '',
                            fix: ''
                        }}
                        validationSchema={Yup.object().shape({
                            societe: Yup.string().max(30).required('Societe Name is required'),
                            telephone: Yup.string()
                                .matches(phoneRegExp, 'Phone number is not valid')
                                .required('telephone is required')
                                .min(10)
                                .max(10),
                            fix: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('fix is required').min(10).max(10),
                            email: Yup.string().email('Must be a valid email').required('Email is required'),
                            responsable: Yup.string().required('Responsable is required!')
                        })}
                        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                            console.log('Form Data:', values);
                            dispatch(
                                insertSociete({
                                    logo: baseUrl,
                                    societe: values.societe,
                                    email: values.email,
                                    responsable: values.responsable,
                                    adresse: values.adresse,
                                    telephone: values.telephone,
                                    fix: values.fix
                                })
                            )
                                .unwrap()
                                .then(() => {
                                    dispatch(fetchSocietes());
                                    navigate('/societes');
                                    handleClose();
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }}
                    >
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            setFieldValue,
                            handleSubmit,
                            isSubmitting,
                            handleReset,
                            touched,
                            values,
                            resetForm
                        }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h4" sx={{ padding: '15px 25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                    Add Societe
                                </Typography>
                                <Grid container spacing={3} sx={{ padding: '10px 40px', margin: '0px 0px' }}>
                                    <Grid item xs={12} style={{ paddingLeft: '0px' }} md={4}>
                                        <InputLabel>Logo*</InputLabel>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            listType="picture-circle"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={(e) => handleChangee(e.fileList, setFieldValue)}
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
                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="societe">Societe*</InputLabel>
                                                <OutlinedInput
                                                    id="societe"
                                                    type="text"
                                                    value={values.societe}
                                                    name="societe"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Societe"
                                                    fullWidth
                                                    error={Boolean(touched.societe && errors.societe)}
                                                />
                                                {touched.societe && errors.societe && (
                                                    <FormHelperText error id="helper-text-societe">
                                                        {errors.societe}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="email">Email*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.email && errors.email)}
                                                    id="email"
                                                    type="email"
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="***@***.com"
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="helper-text-email">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="responsable">Responsable*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.responsable && errors.responsable)}
                                                    id="responsable"
                                                    type="text"
                                                    value={values.responsable}
                                                    name="responsable"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    inputProps={{}}
                                                />
                                                {touched.responsable && errors.responsable && (
                                                    <FormHelperText error id="helper-text-responsable">
                                                        {errors.responsable}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="adresse">Adresse*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.adresse && errors.adresse)}
                                                    id="adresse"
                                                    type="text"
                                                    value={values.adresse}
                                                    name="adresse"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    inputProps={{}}
                                                />
                                                {touched.adresse && errors.adresse && (
                                                    <FormHelperText error id="helper-text-adresse">
                                                        {errors.adresse}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="telephone">Telephone*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.telephone && errors.telephone)}
                                                    id="telephone"
                                                    type="telephone"
                                                    value={values.telephone}
                                                    name="telephone"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="06*******"
                                                    inputProps={{}}
                                                />
                                                {touched.telephone && errors.telephone && (
                                                    <FormHelperText error id="helper-text-telephone-signup">
                                                        {errors.telephone}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="fix">Fix*</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.fix && errors.fix)}
                                                    id="fix"
                                                    type="fix"
                                                    value={values.fix}
                                                    name="fix"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="05*******"
                                                    inputProps={{}}
                                                />
                                                {touched.fix && errors.fix && (
                                                    <FormHelperText error id="helper-text-fix-signup">
                                                        {errors.fix}
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
                                            Add Societe
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
function EditSociete({ open, handleClose, handleOpen, handleEdit, editItem }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const { records, loading, error } = useSelector((state) => state.societes);

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
                        societe: Yup.string().max(30).required('Societe Name is required'),
                        telephone: Yup.string()
                            .matches(phoneRegExp, 'Phone number is not valid')
                            .required('telephone is required')
                            .min(10)
                            .max(10),
                        fix: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('fix is required').min(10).max(10),
                        email: Yup.string().email('Must be a valid email').required('Email is required'),
                        responsable: Yup.string().required('Responsable is required!')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        dispatch(
                            editSociete({
                                id: values.id,
                                logo: baseUrl,
                                societe: values.societe,
                                email: values.email,
                                responsable: values.responsable,
                                adresse: values.adresse,
                                telephone: values.telephone,
                                fix: values.fix
                            })
                        )
                            .unwrap()
                            .then(() => {
                                dispatch(fetchSocietes());
                                navigate('/Societes');
                                handleClose();
                            });
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, handleReset, touched, values, resetForm }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Typography variant="h4" sx={{ padding: '15px 25px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                Edit Societe
                            </Typography>
                            <Grid container spacing={3} sx={{ padding: '10px 40px', margin: '0px 0px' }}>
                                <Grid item xs={12} style={{ paddingLeft: '0px' }} md={4}>
                                    <InputLabel>Logo*</InputLabel>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        listType="picture-circle"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChangee}
                                        value={values.logo}
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
                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="societe">Societe*</InputLabel>
                                            <OutlinedInput
                                                id="societe"
                                                type="text"
                                                value={values.societe}
                                                name="societe"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Societe"
                                                fullWidth
                                                error={Boolean(touched.societe && errors.societe)}
                                            />
                                            {touched.societe && errors.societe && (
                                                <FormHelperText error id="helper-text-societe">
                                                    {errors.societe}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="email">Email*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.email && errors.email)}
                                                id="email"
                                                type="email"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="***@***.com"
                                                inputProps={{}}
                                            />
                                            {touched.email && errors.email && (
                                                <FormHelperText error id="helper-text-email">
                                                    {errors.email}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="responsable">Responsable*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.responsable && errors.responsable)}
                                                id="responsable"
                                                type="text"
                                                value={values.responsable}
                                                name="responsable"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder=""
                                                inputProps={{}}
                                            />
                                            {touched.responsable && errors.responsable && (
                                                <FormHelperText error id="helper-text-responsable">
                                                    {errors.responsable}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="adresse">Adresse*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.adresse && errors.adresse)}
                                                id="adresse"
                                                type="text"
                                                value={values.adresse}
                                                name="adresse"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder=""
                                                inputProps={{}}
                                            />
                                            {touched.adresse && errors.adresse && (
                                                <FormHelperText error id="helper-text-adresse">
                                                    {errors.adresse}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="telephone">Telephone*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.telephone && errors.telephone)}
                                                id="telephone"
                                                type="telephone"
                                                value={values.telephone}
                                                name="telephone"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="06*******"
                                                inputProps={{}}
                                            />
                                            {touched.telephone && errors.telephone && (
                                                <FormHelperText error id="helper-text-telephone-signup">
                                                    {errors.telephone}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="fix">Fix*</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.fix && errors.fix)}
                                                id="fix"
                                                type="fix"
                                                value={values.fix}
                                                name="fix"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="05*******"
                                                inputProps={{}}
                                            />
                                            {touched.fix && errors.fix && (
                                                <FormHelperText error id="helper-text-fix-signup">
                                                    {errors.fix}
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
                                        Edit Societe
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
                        Delete Societe
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

export default function Societeslist() {
    const { records, loading, error } = useSelector((state) => state.societes);
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
        logo: '',
        societe: '',
        email: '',
        responsable: '',
        adresse: '',
        telephone: '',
        fix: '',
        submit: null
    });
    const dispatch = useDispatch();
    const theme = useTheme();

    const InitialRows = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [page, rowsPerPage]);
    const [visibleRows, setvisibleRows] = useState(InitialRows);
    useMemo(() => setvisibleRows(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)), [page, rowsPerPage, records]);

    const deleteRecord = useCallback((id) => dispatch(deleteSociete(id)), [dispatch]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        dispatch(fetchSocietes());
    }, [dispatch]);

    const OpenEdit = () => setOpenEdit(!openEdit);
    const closeEdit = () => setOpenEdit(!openEdit);
    const editHandler = (item) => {
        setEditItem(item);
        console.log(item);
        OpenEdit();
    };
    const handleEdit = () => {
        editRecord(editItem);
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
                    <EditSociete
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
                                            {/* <Avatar src={`https://liya.is-tech.app/storage/${row.logo}`} /> */}
                                            <Avatar src={row.logo} />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{row.societe}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.responsable}</TableCell>
                                    <TableCell align="left">{row.adresse}</TableCell>
                                    <TableCell align="left">{row.telephone}</TableCell>
                                    <TableCell align="left">{row.fix}</TableCell>
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

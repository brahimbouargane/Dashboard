/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Card,
    Grid,
    Stack,
    Typography,
    Fab,
    Modal,
    Button,
    Dialog,
    DialogContentText,
    DialogContent,
    DialogTitle,
    DialogActions,
    InputLabel,
    TextField,
    Chip,
    IconButton,
    OutlinedInput,
    Autocomplete
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Upload, message } from 'antd';

//images
import user1 from '../../../assets/images/users/avatar-1.png';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from '../ComponentSkeleton';
import { fetchExamens, deleteExamen, insertExamen, editExamen } from '../../../store/reducers/examensSlice';

// third party

import * as Yup from 'yup';
import { Formik, FieldArray, Field } from 'formik';
import axios from 'axios';
// ant icnos
import { PlusOutlined, CloseCircleOutlined, LeftOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar } from '../../../../node_modules/@mui/material/index';
import { preventDefault } from '@fullcalendar/core/internal';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// ===============================|| ADD Examen ||=============================== //
function AddExamen({ open, handleOpen, handleClose }) {
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

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

    const handleChangee = ({ fileList: newFileList }, { setFieldValue }) => {
        // Loop through each uploaded file
        newFileList.forEach(async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const base64Image = file.preview; // Extract the base64 representation
            setFieldValue('image', base64Image);
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
    const AddIcon = {
        zIndex: '1050',
        alignItems: 'center',
        flexDirection: 'column-reverse',
        display: 'inline-flex',
        position: 'sticky',
        bottom: '24px',
        left: '100%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer'
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };
    const handleSubmit = (values, { setSubmitting }) => {
        console.log('Form Data:', values);
    };

    return (
        <Box sx={AddIcon}>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <PlusOutlined style={{ fontSize: '1.3rem' }} />
            </Fab>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ p: 1, py: 1.5, width: '50vw' }}>
                    <Formik
                        initialValues={{
                            image: baseUrl,
                            examen: '',
                            questions: ['']
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault(); // Prevent default form submission behavior
                                    handleSubmit(); // Call the formik handleSubmit manually
                                }}
                            >
                                <Typography variant="h4" sx={{ padding: '15px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                    Add Examen
                                </Typography>
                                <DialogContent>
                                    <Grid item xs={12}>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel>Logo*</InputLabel>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    listType="picture-circle"
                                                    fileList={fileList}
                                                    onPreview={handlePreview}
                                                    onChange={(e) => handleChangee(e, { setFieldValue })}
                                                    accept=".png, .jpg, .jpeg"
                                                >
                                                    {fileList.length ? null : uploadButton}
                                                </Upload>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel>Contract Name*</InputLabel>
                                                <TextField
                                                    placeholder="Contract name"
                                                    name="examen"
                                                    value={values.examen}
                                                    onChange={(event) => setFieldValue('name', event.target.value)}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Stack spacing={1}>
                                                <InputLabel>Questions*</InputLabel>
                                                <FieldArray name="questions">
                                                    {({ push, remove }) => (
                                                        <>
                                                            {values.questions.map((question, index) => (
                                                                <div
                                                                    key={index}
                                                                    style={{ display: 'flex', justifyContent: 'space-between' }}
                                                                >
                                                                    <Field
                                                                        as={OutlinedInput}
                                                                        name={`questions[${index}]`}
                                                                        placeholder={`Question ${index + 1}`}
                                                                    />
                                                                    <Button variant="outlined" color="error" onClick={() => remove(index)}>
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <Button variant="outlined" onClick={() => push('')}>
                                                                Add Question
                                                            </Button>
                                                        </>
                                                    )}
                                                </FieldArray>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="error" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Add
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Dialog>
        </Box>
    );
}

AddExamen.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};
// ===============================|| Edit Examen ||=============================== //
function EditExamen({ open, handleOpen, handleClose, editItem }) {
    const [baseUrl, setBaseUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

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

    const handleChangee = ({ fileList: newFileList }, { setFieldValue }) => {
        // Loop through each uploaded file
        newFileList.forEach(async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const base64Image = file.preview; // Extract the base64 representation
            setFieldValue('image', base64Image);
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
    const AddIcon = {
        zIndex: '1050',
        alignItems: 'center',
        flexDirection: 'column-reverse',
        display: 'inline-flex',
        position: 'sticky',
        bottom: '24px',
        left: '100%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer'
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };
    const handleSubmit = (values, { setSubmitting }) => {
        console.log('Form Data:', values);
    };

    return (
        <Box sx={AddIcon}>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <PlusOutlined style={{ fontSize: '1.3rem' }} />
            </Fab>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ p: 1, py: 1.5, width: '50vw' }}>
                    <Formik initialValues={editItem} onSubmit={handleSubmit}>
                        {({ values, setFieldValue, handleSubmit, isSubmitting }) => {
                            return (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault(); // Prevent default form submission behavior
                                        handleSubmit(); // Call the formik handleSubmit manually
                                    }}
                                >
                                    <Typography variant="h4" sx={{ padding: '15px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                                        Edit Examen
                                    </Typography>
                                    <DialogContent>
                                        <Grid item xs={12}>
                                            <Grid item xs={12} sx={{ mt: 1 }}>
                                                <Stack spacing={1}>
                                                    <InputLabel>Logo*</InputLabel>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        listType="picture-circle"
                                                        fileList={fileList}
                                                        onPreview={handlePreview}
                                                        value={values.icon}
                                                        onChange={(e) => handleChangee(e, { setFieldValue })}
                                                        accept=".png, .jpg, .jpeg"
                                                    >
                                                        {fileList.length ? null : uploadButton}
                                                    </Upload>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 1 }}>
                                                <Stack spacing={1}>
                                                    <InputLabel>Contract Name*</InputLabel>
                                                    <TextField
                                                        placeholder="Contract name"
                                                        name="examen"
                                                        value={values.examen}
                                                        onChange={(event) => setFieldValue('name', event.target.value)}
                                                    />
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 1 }}>
                                                <Stack spacing={1}>
                                                    <InputLabel>Questions*</InputLabel>

                                                    <FieldArray name="question">
                                                        {({ push, remove }) => (
                                                            <>
                                                                {values.question.map((ques, index) => (
                                                                    <div
                                                                        key={index}
                                                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                                                    >
                                                                        <Field
                                                                            as={OutlinedInput}
                                                                            name={`question[${index}].question`}
                                                                            placeholder={`Question ${index + 1}`}
                                                                            value={ques.question} // Access the question field directly
                                                                        />
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="error"
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                                <Button variant="outlined" onClick={() => push('')}>
                                                                    Add Question
                                                                </Button>
                                                            </>
                                                        )}
                                                    </FieldArray>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color="error" onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" type="submit">
                                            Edit
                                        </Button>
                                    </DialogActions>
                                </form>
                            );
                        }}
                    </Formik>
                </Box>
            </Dialog>
        </Box>
    );
}

EditExamen.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};

function DisplayExamen({ item, open, handleClose, handleDispaly }) {
    const { records, loading, error } = useSelector((state) => state.examens);
    const dispatch = useDispatch();

    const renderQuestions = () => {
        if (!item || !item.question) {
            return null;
        }

        return item.question.map((ques) => (
            <Typography key={ques.id} variant="body1" sx={{ mt: '5px', py: '5px', px: '10px' }}>
                {ques.question}
            </Typography>
        ));
    };
    useEffect(() => {
        dispatch(fetchExamens());
    }, []);
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <Box sx={{ px: 2, py: 2, minHeight: '250px', minWidth: '330px' }}>
                <Typography variant="h4"> {item ? item.examen : ''}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '10px' }}>
                    <Avatar sx={{ width: 90, height: 90 }} src={item ? item.icon : ''} alt="user1" />
                    <Typography variant="body1" sx={{ mt: '5px' }}>
                        {item ? item.examen : ''}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4">Questions</Typography>
                    {renderQuestions()}
                </Box>
            </Box>
        </Dialog>
    );
}
// DisplayExamen.propTypes = {
//     open: PropTypes.bool,
//     handleOpen: PropTypes.func.isRequired,
//     handleClose: PropTypes.func.isRequired,
//     item: PropTypes.object
// };

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
                        Delete Examen
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
// ===============================|| Examen ||=============================== //

const Examen = () => {
    const { records, loading, error } = useSelector((state) => state.examens);
    const items = records['0'];

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState({
        id: '',
        icon: '',
        examen: '',
        questions: ['']
    });
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState();
    const [selectedItem, setSelectedItem] = useState(null);
    const [openExamen, setOpenExamen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(!open);

    const handleOpenExamen = () => setOpenExamen(!openExamen);
    const handleCloseExamen = () => setOpenExamen(!openExamen);

    const OpenEdit = () => setOpenEdit(!openEdit);
    const closeEdit = () => setOpenEdit(!openEdit);
    const editHandler = (item) => {
        setEditItem(item);
        OpenEdit();
    };
    const displayHandler = (item) => {
        setSelectedItem(item);
        handleOpenExamen();
    };
    const displayItem = (item) => {
        setEditItem(item);
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

    useEffect(() => {
        dispatch(fetchExamens());
    }, [dispatch]);

    return (
        <ComponentSkeleton>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                {items &&
                    items.map((item) => (
                        <Grid key={item.id} item xs={12} sm={4} md={4} lg={3}>
                            <MainCard
                                contentSX={{ py: 1.5, px: 1.5 }}
                                sx={{ width: 'fit-content', cursor: 'pointer', width: '100%', margin: 'auto' }}
                            >
                                <IconButton shape="rounded" variant="contained" color="secondary" onClick={() => displayHandler(item)}>
                                    <EyeOutlined />
                                </IconButton>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '10px' }}>
                                    <Avatar
                                        sx={{ width: 56, height: 56 }}
                                        src={`https://liya.is-tech.app/storage/${item.icon}`}
                                        alt="user1"
                                    />
                                    <Typography variant="h4" sx={{ mt: '5px' }}>
                                        {item.examen}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        style={{ marginTop: '10px', marginRight: '10px' }}
                                        onClick={() => deleteHandler(item)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        style={{ marginTop: '10px', marginLeft: '10px' }}
                                        onClick={() => editHandler(item)}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </MainCard>
                        </Grid>
                    ))}
            </Grid>
            <DisplayExamen
                open={openExamen}
                handleOpen={handleOpenExamen}
                handleClose={handleCloseExamen}
                item={selectedItem}
                handleDispaly={displayItem}
            />
            <DeleteModal open={openDelete} handleOpen={OpenDelete} handleClose={closeDelete} handleDelete={handleDelete} />
            <EditExamen open={openEdit} handleOpen={OpenEdit} handleClose={closeEdit} editItem={editItem} />
            <AddExamen open={open} handleOpen={handleOpen} handleClose={handleClose} />
        </ComponentSkeleton>
    );
};

export default Examen;

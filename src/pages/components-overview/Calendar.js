import { useRef, useState, useEffect } from 'react';
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
    Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
import '../../assets/third-party/fullCalendar.css';

// third party
// import FullCalendar, { formatData } from '@fullcalendar/react'; // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import listPlugin from '@fullcalendar/list';
// import multiMonthPlugin from '@fullcalendar/multimonth';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
// ant icnos
import { PlusOutlined, CloseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { setYear } from 'date-fns';
import { values } from 'lodash';

// ===============================|| ADD INTERVENTION ||=============================== //
function AddIntervention({ open, handleOpen, handleClose }) {
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

    const formik = useFormik({
        initialValues: {
            title: '',
            date: ''
        },
        onSubmit: (values) => {
            console.log(values);
        }
    });
    return (
        <Box sx={AddIcon}>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <PlusOutlined style={{ fontSize: '1.3rem' }} />
            </Fab>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ p: 1, py: 1.5, width: '50vw' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography variant="h4" sx={{ padding: '15px', borderBottom: '1px solid rgb(240, 240, 240)' }}>
                            Add Intervention
                        </Typography>
                        <DialogContent>
                            <Grid item xs={12}>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="user-signup">Intervention*</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="title"
                                            label="Intervention"
                                            onChange={formik.handleChange}
                                            value={formik.values.title}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="user-signup">Date*</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                id="date"
                                                fullWidth
                                                inputFormat="MM/dd/yyyy"
                                                onChange={formik.handleChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit" onClick={handleClose}>
                                Add
                            </Button>
                        </DialogActions>
                    </form>
                </Box>
            </Dialog>
        </Box>
    );
}

AddIntervention.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};
// ===============================|| CALENDAR ||=============================== //

// ===============================|| COMPONENT - COLOR ||=============================== //

const Calendar = () => {
    const theme = useTheme();
    const [year, setYear] = useState(new Date().getFullYear());
    const [open, setOpen] = useState(false);
    const [intervention, setIntervention] = useState([]);

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    // Create an object to group dates by month
    const datesByMonth = {};

    // Initialize datesByMonth object with empty arrays for each month
    monthNames.forEach((monthName) => {
        datesByMonth[monthName] = [];
    });

    intervention.forEach((item) => {
        const dateString = item.date_intervention;
        const date = new Date(dateString);
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        const contratId = item.contrat_id;
        const statusColor = item.status.status;
        const vehicule = item.contrat.vehicule.matricule;
        const societe = item.contrat.societe.societe;

        datesByMonth[monthName].push({ contratId, dateString, statusColor, vehicule, societe });
    });

    const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(!open);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://liya.is-tech.app/api/Intervention/${year}`, {
                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer 64t7xzO2OMbaBzSclXb4fXReOtaW5zzIYPFmsRHM' }
                });
                setIntervention(res.data);
                return res.data;
            } catch (error) {
                return error;
            }
        };
        fetchData();
    }, [year]);

    return (
        <ComponentSkeleton>
            <Box>
                <Box className="calendar">
                    <Button
                        onClick={() => {
                            setYear(year - 1);
                        }}
                    >
                        <LeftOutlined />
                    </Button>
                    <Typography variant="h3">{year}</Typography>
                    <Button
                        onClick={() => {
                            setYear(year + 1);
                        }}
                    >
                        <RightOutlined />
                    </Button>
                </Box>
                <Box className="monthsGrid">
                    {monthNames.map((monthName) => (
                        <Box key={monthName} className="month">
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                {monthName}
                            </Typography>
                            {datesByMonth[monthName].map((date) => (
                                <>
                                    <Chip
                                        sx={{ m: 1, p: 1 }}
                                        label={`Contract ID: ${date.contratId}. Date Intervention: ${date.dateString}. Vehicule Matricule: ${date.vehicule}. societe: ${date.societe}`}
                                        color={date.statusColor === 'Terminer' ? 'success' : 'warning'}
                                        key={`${date.contratId}-${date.dateString}`}
                                    />
                                    <br />
                                </>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
            <AddIntervention open={open} handleOpen={handleOpen} handleClose={handleClose} />
        </ComponentSkeleton>
    );
};

export default Calendar;

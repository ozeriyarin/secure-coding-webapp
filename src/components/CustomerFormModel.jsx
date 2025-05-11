import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// MUI imports
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// date pickers
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';



/**
 * Main component of the Add/Edit customers view.
 * This modal allows the user to add or edit an customer based on whether the `initialData` is provided.
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.open -  Boolean indicating if the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSubmit - Function to submit the form.
 * @param {object} props.initialData - Initial data to fill the form.
 * @returns {JSX.Element} -  The JSX representing the customer Form Modal.
 */
export default function CustomerFormModal({
  open,
  onClose,
  onSubmit,
  initialData, // If null => Add mode, else => Edit mode
}) {

    // Determine if the user in 'add' or 'edit' mode
    const isEditMode = Boolean(initialData && initialData.id);

    // States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState(null); // Date object

    const [invalidFields, setInvalidFields] = useState({ // State for error bold fields
        firstName: false,
        lastName: false,
        phoneNumber: false,
        email: false,
        birthday: false,
    });

    const addCustomer = async (customerDetails) => {
        try {
          console.log('Adding customer:', customerDetails);
            const response = await fetch('/api/customers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerDetails),
            });
            if (!response.ok) {
                throw new Error('Failed to add customer');
            }
            const data = await response.json();
            console.log('Customer added successfully:', data);
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    }

  // Set States
  useEffect(() => {
    // if the user in 'edit' mode
    if (isEditMode && initialData) {
      // Parse the date 'DD/MM/YYYY'
        const [day, month, year] = initialData.formattedDate.split('/');
        const date = new Date(year, month - 1, day);
        setBirthday(date);
      // Set the other states
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setPhoneNumber(initialData.phoneNumber || '');
        setEmail(initialData.email || '');
    } else {
      // Otherwise, reset states for 'Add' mode
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setBirthday('');
    }
  }, [isEditMode, initialData]);

  /* ====================================================================  */
  /*                              Handlers                                 */
  /* ====================================================================  */
  /**
 
   * Handler which is called when Date changes
   * @param newValue - The new value selected (typically a date object).
   */
    const handleBirthDayChange = (newValue) => {
        if (newValue) {
        let selectedDate = newValue;
        selectedDate = new Date(selectedDate);
        setBirthday(selectedDate);
        } else {
        setBirthday('');
        }
    };

    /** 
     * Handler which is called when the firstName changes.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
    **/
    function handleFirstNameChange(event) {
        const input = event.target.value;
        if (input.trim().length <= 50)
        setInvalidFields((prev) => ({ ...prev, firstName: false }));
        setFirstName(input);
    }

    /**
     * Handler which is called when the lastName changes.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
    **/
    function handleLastNameChange(event) {
        const input = event.target.value;
        if (input.trim().length <= 50)
            setInvalidFields((prev) => ({ ...prev, lastName: false }));
        setLastName(input);
    }


    /**
     * Handler which is called when the phoneNumber changes.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
    **/
    function handlePhoneNumberChange(event) {
        const input = event.target.value;
        if (input.trim().length <= 50)
            setInvalidFields((prev) => ({ ...prev, phoneNumber: false }));
        setPhoneNumber(input);
    }

    /**
     * Handler which is called when the email changes.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
    **/
    function handleEmailChange(event) {
        const input = event.target.value;
        if (input.trim().length <= 50)
            setInvalidFields((prev) => ({ ...prev, email: false }));
        setEmail(input);
    }


  /**
   * Handler which is called when:
   * 1. the user clicks submit
   * 2. user clicks clear button
   * Checkups: a value was selected
   */
  function clearFormHandler() {
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setBirthday('');
    setInvalidFields({ firstName: false, lastName: false, phoneNumber: false, email: false, birthday: false });
  }

  /**
   * Handler which is called when a user clicks the submit button.
   * Checks the input fields and activates the `onAddCustomer` callback with the new customer data.
   * @param {React.FormEvent} event - The form submission event.
   */
  async function submitHandler (event) {
    event.preventDefault(); // we want to handle the submit event manually.

    setInvalidFields({
      firstName: false,
      lastName: false,
      phoneNumber: false,
      email: false,
      birthday: false,
    });

    const empties = {
      firstName: !firstName.trim(),
      lastName:  !lastName.trim(),
      phoneNumber:!phoneNumber.trim(),
      email:     !email.trim(),
      birthday:  !birthday,
    };

    const namePattern  = /^[A-Za-z\u0590-\u05FF\s'-]{2,50}$/;    // letters/spaces/’–, length 2–50
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;          // basic email
    const phonePattern = /^\+?[0-9]{7,15}$/;            // 7-15 digits,'+' at the start   


    const formats = {
      firstName:   !empties.firstName && !namePattern.test(firstName),
      lastName:    !empties.lastName  && !namePattern.test(lastName),
      email:       !empties.email     && !emailPattern.test(email),
      phoneNumber: !empties.phoneNumber && !phonePattern.test(phoneNumber),
    };

    const newInvalid = {
      firstName:   empties.firstName   || formats.firstName,
      lastName:    empties.lastName    || formats.lastName,
      phoneNumber: empties.phoneNumber || formats.phoneNumber,
      email:       empties.email       || formats.email,
      birthday:    empties.birthday,
    };
    setInvalidFields(newInvalid);

    if (Object.values(newInvalid).some(Boolean)) {
      return;
    }

    /* ========================= Create a customer object ==============================  */

    const id = isEditMode ? initialData.id : uuidv4(); // Generate a new ID for the customer

    // Format the date
    const formattedDate = dayjs(birthday).format('YYYY-MM-DD');

    const customerDetails = {
        // If editing, keep the same id; if adding, no id needed.
        id: id,
        first_name:firstName,
        last_name: lastName,
        phone : phoneNumber,
        email: email,
        birthday: formattedDate,
    };

    // Call parent
    onSubmit(customerDetails, isEditMode);
    // Add customer to the database
    if (!isEditMode) {
      await addCustomer(customerDetails);
    }
    // Clear form or close modal
    clearFormHandler();
  }

  /* ====================================================================  */
  /*                     Main {JSX.Element} To Display                     */
  /* ====================================================================  */
  // Title & Button label
  const title = isEditMode
    ? `Edit Customer: ${initialData.firstName} ${initialData.lastName}`
    : 'Add Customer';

  const buttonLabel = isEditMode ? 'Update' : 'Add';

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          width: 750,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 1,
            backgroundColor: 'primary.main',
          }}
        >
          <Typography variant='h6' color='white'>
            {title}
          </Typography>
          <IconButton
            edge='end'
            onClick={() => {
              onClose();
              clearFormHandler();
            }}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ padding: '26px' }}>
          <form onSubmit={submitHandler}>
            {/* First Row: First Name, Last Name, Birthday*/}
            <Box sx={{ display: 'flex', alignItems: 'top' , gap: 3 , mt: 2 }}>
              {/* First Name */}
                <TextField
                    style={{ width: 200 }}
                    label='First Name*' // Required
                    value={firstName}
                    onChange={handleFirstNameChange}
                    error={invalidFields.firstName}
                    helperText={invalidFields.firstName ? 'Field is required' : ''}
                />
                {/* Last Name */}
                <TextField
                    style={{ width: 200 }}
                    label='Last Name*'
                    value={lastName}
                    onChange={handleLastNameChange}
                    error={invalidFields.lastName}
                    helperText={invalidFields.lastName ? 'Field is required' : ''}
                />
                {/* Birthday */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box>
                      <DatePicker
                        label='Birthday'
                        onChange={handleBirthDayChange}
                        value={dayjs(birthday)}
                        disableFuture
                        slotProps={{
                          textField: {
                            required: true,
                            error: invalidFields.birthday,
                            helperText: invalidFields.birthday ? 'Field is required' : '',
                          }
                        }}
                      />
                    </Box>
                </LocalizationProvider>
            </Box>

            {/* Second Row: Phone Number, Email*/}
            <Box sx={{ display: 'flex', alignItems: 'top', gap: 3 , mt: 2 }}>
                {/* Phone Number */}
                <TextField
                    style={{ width: 250 }}
                    label='Phone Number*'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={invalidFields.phoneNumber}
                    helperText={invalidFields.phoneNumber ? 'Field is required' : ''}
                />
                {/* Email */}
                <TextField
                    style={{ width: 250 }}
                    label='Email*'
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    error={invalidFields.email}
                    helperText={invalidFields.email ? 'Field is required' : ''}
                />
            </Box>

            {/* Third Row: Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant='contained' color='error' onClick={clearFormHandler}>
                Clear All
              </Button>
              <Button variant='contained' color='primary' type='submit'>
                {buttonLabel}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

// PropTypes validation
CustomerFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object, // or null
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
};


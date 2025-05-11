import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from "prop-types";
import { useLocation,useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import CustomerTable from './CustomerTable';
import CustomerFormModal from "./CustomerFormModel";

// #####################################################################
//                        Additional Component
// #####################################################################
/**
 * SuccessDialog component
 * This component displays a dialog with a success message.
 * @param {boolean} open - Dialog open state
 * @param {string} message - Dialog message
 * @param {function} onClose - Dialog close handler
 * @returns SuccessDialog component to display a success dialog with a message.
 */
function SuccessDialog({ open, message, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleOutlineIcon color='success' />
        <Typography variant='body1'>{message}</Typography>
      </Box>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Prop types for SuccessDialog component
SuccessDialog.propTypes = {
  open: PropTypes.bool.isRequired, // The open state of the dialog.
  message: PropTypes.string.isRequired, // The message to display in the dialog.
  onClose: PropTypes.func.isRequired, // The function to close the dialog.
};

// #####################################################################
//               Main component of the Home view
// #####################################################################
/**
 * Main component of the Home view.
 * This component displays table for a customers.
 * edit existing customer, add and remove customers.
 * @returns {JSX.Element} he main component displaying the customer-related content.
 */
export default function HomeScreen() {
  // ============ States ===============
  const [customers, setCustomers] = useState([]);
//   const [, setLoading] = useState(true);

  // State that holds either null (for adding) or an customer object (for editing)
  const [modalData, setModalData] = useState(null);
  // State to manage the visibility of addition modal
  const [isModelOpen, setIsModelOpen] = useState(false);

  // State to manage visibility of dialog of adding/ editing success
  const [isSuccessDialogShown, setIsSuccessDialogShown] = useState(false);
  // State to manage the message of adding/ editing success
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const location = useLocation();
  const { userId } = location.state || {};


  // useEffect to fetch customers from DB when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Fetch all customers from the database
        const allCustomers = await fetch('/api/customers/get_all/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!allCustomers.ok) {
          const errorData = await allCustomers.json();
          console.error('Error fetching customers:', errorData.message);
          return;
        }
        const customersData = await allCustomers.json();
        setCustomers(customersData.customers); // Set the customers state with the fetched data
        console.log('Fetched customers:', customersData.customers);

        }catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);
// ===========================

  /* ====================================================================  */
  /*                              Handlers                                 */
  /* ====================================================================  */
  /**
//    * Handler which is called when the year changes
//    * @param e - The event object from the Select component.
//    */
//   const handleYearChange = (e) => {
//     setYear(e.target.value);
//   };

//   /**
//    * Handler which is called when the year changes
//    * @param e - The event object from the Select component.
//    */
//   const handleMonthChange = (e) => {
//     setMonth(e.target.value);
//   };


  /**
   * Handler which is called as a result of pressing "Add Customer"
   * Sets state of isModalOpen to true
   */
  // Opening the 'Add' modal => pass `null` as `modalData`
  const openAddModal = () => {
    setModalData(null); // null means create
    setIsModelOpen(true);
  };

  /**
   * Handler which is called as a result of pressing "Edit Customer"
   * Sets state of isModalOpen to true
   * @param customer - The customer object to be edited.
   */
  const openEditModal = (customer) => {
    setModalData(customer);
    setIsModelOpen(true);
  };

  /**
   * Handler which is called as a result of closing the modal
   * Sets state of isModalOpen to false
   */
  const closeModal = () => {
    setIsModelOpen(false);
  };

  /**
   * Handler which is called after user closes the dialog of success message.
   * Sets state of isSuccessDialogShown to false
   */
  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogShown(false);
  };

  /**
   * Handles the form submission (either adding or editing a customer).
   * If isEditMode => update an existing customer. Else => add a new one.
   * @param customerDetails - The details of the customer to add or update.
   * @param isEditMode - Whether the operation is to edit an existing customer.
   * @returns {Promise<void>} - A promise that resolves when the customers are re-fetched and filtered.
   */
  const handleModalSubmit = (customerDetails, isEditMode) => {
    try {
      if (isEditMode) {
        const { id, ...updatedFields } = customerDetails;
        setSuccessMessage('The customer was updated successfully!');
      } else {
        /**
          Add a new customer
          id: contains the value of the `id` key from the object.
          rest: a new object containing all other keys and values remaining in the object, except for the `id` key.
        **/
        const id = uuidv4();
        const newCustomer  = { ...customerDetails , id }; // copy of customerDetails
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        setSuccessMessage('The customer was added successfully!');
      }

      // Close the modal
      closeModal();
      // Show success dialog
      setIsSuccessDialogShown(true);

      // Re-fetch updated list of customers
    } catch (error) {
      console.error('Error adding/updating customer:', error);
    }
  };
    // Logout the user
    function handleLogout() {
        // Redirect to the login page
        navigate('/');
    }

    // Change password
    function handleChangePassword() {
        // Redirect to the change password page
        navigate('/change-password' , { state: { userId: userId } });
    }

  /**
   * Handler for remove an expense from the IndexedDB by its ID and re-fetches the updated list of expenses
   * for the selected month and year.
   * @param id - The ID of the expense to remove from the database.
   * @returns {Promise<void>} - A promise that resolves when the expense is removed and the expenses are re-fetched.
   */
  const handleRemove = async (id) => {
    try {
      await indexDB.removeExpense(id);
      // Re-fetch updated list of expenses
      const all = await indexDB.getAllExpenses();
      filterExpensesByMonthYear(all, month, year);
    } catch (error) {
      console.error('Error removing expense:', error);
    }
  };

  /* ====================================================================  */
  /*                     Main {JSX.Element} To Display                     */
  /* ====================================================================  */
  return (
    <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '11%',
        width: '100%', 
        maxWidth: '1200px',   
        mx: 'auto',            
        p: 2,                  
        height: '100%',
        overflowY: 'auto',
      }}>
      {/* Title */}
      <Typography variant='h4' gutterBottom style={{ color: '#fff', marginBottom: 40 }}>
        Customers Table
      </Typography>

      {/* Logout display */}
      <Box
        sx={{
          position: 'absolute',
          top: 5,
          right: 0,
          padding: '10px  ',
          margin: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button variant='contained' color='primary' sx={{ fontWeight: 'bold' , marginRight: 2}}
          onClick={handleChangePassword}>
          Change Password
        </Button>
        
        <Button variant='contained' color='primary' sx={{ fontWeight: 'bold' }}
          onClick={handleLogout}>
          Logout
        </Button>

        
      </Box>

      {/* Form Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {/* Add Customer Button */}
        <Button
          variant='contained'
          color='primary'
          onClick={openAddModal}
        >
          Add New Customer
        </Button>
      </Box>

      {/* Customer Table */}
      <CustomerTable
        customers={customers}
        handleEdit={(customerId) => {
          // Find customer using customerId directly
          const selectedCustomer = customers.find((customer) => customer.id === customerId);
          openEditModal(selectedCustomer);
        }}
        handleRemove={handleRemove}
      />

      {/* Modal and Dialog Components */}
        <CustomerFormModal
            open={isModelOpen}
            onClose={closeModal}
            onSubmit={handleModalSubmit}
            customer={modalData}
        />

      {/* Success Dialog */}
      <SuccessDialog open={isSuccessDialogShown} onClose={handleCloseSuccessDialog} message={successMessage} />
    </Box>
  );
}


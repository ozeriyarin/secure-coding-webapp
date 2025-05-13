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
  Paper,
  Container,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        minWidth: 300 
      }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
        <Typography variant="body1" sx={{ color: 'text.primary' }}>{message}</Typography>
      </Box>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
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
 * This component displays table for customers and allows adding new customers.
 * @returns {JSX.Element} The main component displaying the customer-related content.
 */
export default function HomeScreen() {
  const [customers, setCustomers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  // Fetch customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers/get_all/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching customers:', errorData.message);
          return;
        }
        const customersData = await response.json();
        setCustomers(customersData.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const openAddModal = () => {
    setIsModelOpen(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
  };

  const handleModalSubmit = async (customerDetails) => {
    try {
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

      // Refresh customers list
      const updatedResponse = await fetch('/api/customers/get_all/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setCustomers(data.customers);
      }

      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Navigation handlers
  const handleLogout = () => {
    navigate('/');
  };

  const handleChangePassword = () => {
    navigate('/change-password', { state: { userId } });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      pt: '64px' // Height of navbar
    }}>
      <Container 
        maxWidth={false}
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
        }}
      >
        {/* Header with Title and Add Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            gap: 2,
            width: '100%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 32, color: '#1976D2' }} />
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#1976D2',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}
            >
              Customer Management
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={openAddModal}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#1976D2',
              borderRadius: 1,
              textTransform: 'none',
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#1565C0',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            Add Customer
          </Button>
        </Box>

        {/* Main Content */}
        <Paper 
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            width: '100%',
            mb: 3,
            '&:hover': {
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 5px 15px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <Box 
            sx={{ 
              width: '100%',
              overflowX: 'auto',
              overflowY: 'auto',
              minHeight: '600px',
              maxHeight: 'calc(100vh - 300px)'
            }}
          >
            <CustomerTable customers={customers} />
          </Box>
        </Paper>

        {/* Add Customer Modal */}
        <CustomerFormModal
          open={isModelOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      </Container>
    </Box>
  );
}


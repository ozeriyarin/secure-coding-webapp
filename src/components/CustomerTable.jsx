import PropTypes from "prop-types";
import {
    Box,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
  } from '@mui/material';
  import dayjs from 'dayjs'; 
  // MUI Icons
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';


/**
 * CustomerTable component displays a list of customers in a table format with actions to edit or remove each customer.
 * @param customers - Array of customers objects to display in the table.
 * @param handleEdit- Function to handle the edit action. Takes customer ID as an argument.
 * @param handleRemove - Function to handle the remove action. Takes customer ID as an argument.
 * @returns {JSX.Element} The CustomerTable component rendering a table with customers and edit/remove buttons.
 */
  export default function CustomerTable({ customers, handleEdit, handleRemove }) {
    return (
      <Box sx={{ maxHeight: 450, overflowY: 'auto', border: '2px solid #f0f0f0' }}>
        <TableContainer component={Paper} sx={{ minWidth: 650, maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  ID
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  First Name
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  Last Name
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  Age
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  Phone Number
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  Email
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  Birthday
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* If no customers found, display a message else show the customers*/}
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{customer.first_name}</TableCell>
                    <TableCell align='center'>{customer.last_name}</TableCell>
                    <TableCell align='center'>
                      {Math.floor((Date.now() - new Date(customer.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                    </TableCell>
                    <TableCell align='center'>{customer.phone}</TableCell>
                    <TableCell align='center'>{customer.email}</TableCell>
                    <TableCell align='center'>{dayjs(customer.birthday).format('DD/MM/YYYY')}</TableCell>
                    {/* <TableCell align='center'>
                      <Button
                        variant='text'
                        color='info'
                        onClick={() => handleEdit(customer.id)}
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        variant='text'
                        color='error'
                        onClick={() => handleRemove(customer.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

// Adding prop types validation
CustomerTable.propTypes = {
    customers: PropTypes.array.isRequired, // The array of customer objects to display in the table.
    handleEdit: PropTypes.func.isRequired, // The function to handle the edit action.
    handleRemove: PropTypes.func.isRequired, // The function to handle the remove action
};
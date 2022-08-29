// Shared dialog component.

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import StandardDropdown from './shared/StandardDropdown';
import { useEffect, useState } from 'react';
import { loadDynamicData, stripHTML } from '../CMS/helpers';
import { PROJECT_NAME } from '../constants';
import ContactForm from './ContactForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal({
    websiteContent, buttonText, isOpen, setIsOpen, showTripsDropdown
}) {
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
  
    return (
      <div>
        {/* <Button onClick={handleOpen}>{buttonText}</Button> */}
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2 id="dialogTitle">Find out more...</h2>
            <div id={"modal-modal-description"} sx={{ mt: 2 }}>
              <div id={'dialogDesc'}>

                <ContactForm showTripsDropdown={showTripsDropdown} />

              </div>
            </div>
          </Box>
        </Modal>
      </div>
    );
}

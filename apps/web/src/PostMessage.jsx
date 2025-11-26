import { useState, useEffect, useRef } from 'react';
import { Typography, Box, TextField, Button, Paper, IconButton, Popover, Alert } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Snackbar from '@mui/material/Snackbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const MAX_CHARACTERS = parseInt(import.meta.env.VITE_MAX_MESSAGE_LENGTH) || 250;
const DEFAULT_RECIPIENT = import.meta.env.VITE_DEFAULT_RECIPIENT || 'default';

function PostMessage() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");
    
    const handleEmojiButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseEmojiPicker = () => {
        setAnchorEl(null);
    };
    const handleEmojiSelect = (emoji) => {
        setMessage(message + emoji.emoji);
        handleCloseEmojiPicker();
    };
    const openEmojiPicker = Boolean(anchorEl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add this helper function to calculate remaining characters
    const remainingChars = MAX_CHARACTERS - message.length;
    

    const handlePost = async () => {
        if (!message) return;

        try {
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient, content: message, image })
            });

            // Check if the response is not ok (status code outside 200-299)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Optional: get the response data
            const data = await response.json();
            
            // Clear form
            setMessage('');
            setImage(null);

            // Success toast
            setToastMessage("Your message was posted successfully!");
            setToastSeverity("success");
            setOpenToast(true);

            console.log("Message sent successfully", data);
        } catch (error) {
            console.error("Failed to send message:", error);

            // Error toast
            setToastMessage(`Failed to send message: ${error.message}`);
            setToastSeverity("error");
            setOpenToast(true);
        }

        setMessage('');
        setImage(null);
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            width: '100vw', 
            bgcolor: 'primary.main', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 2, sm: 4 } // Vertical padding for mobile
        }}>
            <Paper 
                elevation={4} 
                sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                    borderRadius: 4, 
                    width: { xs: '95%', sm: '80%', md: '60%', lg: '40%' }, // Responsive width
                    maxWidth: '800px', // Maximum width
                    maxHeight: { xs: '95vh', sm: '90vh' }, // Responsive max height
                    overflowY: 'auto', // Scrollable
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Typography 
                            variant="h4" 
                            fontWeight={700} 
                            color='primary.main'
                            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }} // Responsive font size
                        >
                            Messages Board
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'right', position: 'relative' }}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            onChange={handleImageChange}
                            disabled={Boolean(image)}     // ⬅ prevents choosing more images
                        />
                        <label htmlFor="image-upload">
                            <IconButton 
                                title="add an image" 
                                aria-label="add an image" 
                                component="span"
                                disabled={Boolean(image)}   // ⬅ disables the icon
                            >
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </label>
                        <IconButton title="add an emoji" aria-label="add an emoji" onClick={handleEmojiButtonClick}>
                            <EmojiEmotionsIcon />
                        </IconButton>
                    </Box>
                    <Popover
                        open={openEmojiPicker}
                        anchorEl={anchorEl}
                        onClose={handleCloseEmojiPicker}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </Popover>
                    <TextField
                        fullWidth
                        label="Type your message"
                        multiline
                        minRows={3}
                        variant="outlined"
                        value={message}
                        onChange={e => {
                            if (e.target.value.length <= MAX_CHARACTERS) {
                                setMessage(e.target.value);
                            }
                        }}
                        sx={{ mb: 1 }}
                        helperText={`${remainingChars} characters remaining`}
                        error={remainingChars < 20} // Shows red when less than 20 chars left
                    />
                    {image && (
                        <Box sx={{ 
                            textAlign: 'center', 
                            mb: 2,
                            position: 'relative',
                            bgcolor: 'grey.100',
                            borderRadius: 2,
                            p: 2,
                            // Fixed height - won't grow beyond this
                            height: { xs: '150px', sm: '200px', md: '250px' },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img 
                                src={image} 
                                alt="uploaded preview" 
                                style={{ 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain', // Scales down large images proportionally
                                    display: 'block'
                                }} 
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setImage(null)}
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    textTransform: 'none'
                                }}
                            >
                                Remove
                            </Button>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                        onClick={handlePost}
                        disabled={!message}
                    >
                        Post Message
                    </Button>
                </Paper>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={openToast}
                    autoHideDuration={5000}
                    onClose={handleCloseToast}
                >
                    <Alert 
                        onClose={handleCloseToast} 
                        severity={toastSeverity} 
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {toastMessage}
                    </Alert>
                </Snackbar>
        </Box>
    );
}

export default PostMessage;
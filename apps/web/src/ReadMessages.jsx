import { useState, useEffect, useRef } from 'react';
import { Fade, Typography, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ReadMessages() {
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('default');
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const textContainerRef = useRef(null);

  const API_URL = 'http://localhost:4000';

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())

    fetch(`${API_URL}/messages/${recipient}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [recipient]);

  const handlePrev = () => {
    if (current > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrent(current - 1);
        setFade(true);
      }, 300);
    }
  };

  const handleNext = () => {
    if (current < messages.length - 1) {
      setFade(false);
      setTimeout(() => {
        setCurrent(current + 1);
        setFade(true);
      }, 300);
    }
  };

  const msg = messages[current];

  // Calculate dynamic font size based on message length and if there's an image
  const getDynamicFontSize = () => {
    if (!msg?.content) return { xs: '2rem', sm: '2.5rem', md: '3rem' };
    
    const hasImage = !!msg?.image;
    const textLength = msg.content.length;
    
    if (hasImage) {
      // With image - smaller fonts
      if (textLength < 50) return { xs: '1.5rem', sm: '2rem', md: '2.5rem' };
      if (textLength < 100) return { xs: '1.25rem', sm: '1.75rem', md: '2rem' };
      if (textLength < 150) return { xs: '1.1rem', sm: '1.5rem', md: '1.75rem' };
      return { xs: '1rem', sm: '1.25rem', md: '1.5rem' };
    } else {
      // Without image - larger fonts
      if (textLength < 50) return { xs: '2rem', sm: '2.5rem', md: '3rem' };
      if (textLength < 100) return { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' };
      if (textLength < 150) return { xs: '1.5rem', sm: '2rem', md: '2.5rem' };
      if (textLength < 200) return { xs: '1.25rem', sm: '1.75rem', md: '2rem' };
      return { xs: '1.1rem', sm: '1.5rem', md: '1.75rem' };
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw', 
      bgcolor: 'primary.main', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Previous button */}
      <Box sx={{ 
        position: 'absolute', 
        left: { xs: 4, sm: 16, md: 24 }, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        zIndex: 10 
      }}>
        <IconButton 
          onClick={handlePrev} 
          disabled={current === 0} 
          size="large" 
          sx={{ 
            color: 'secondary.main',
            '&.Mui-disabled': { color: 'rgba(241, 241, 230, 0.3)' }
          }}
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
      </Box>
      
      {/* Next button */}
      <Box sx={{ 
        position: 'absolute', 
        right: { xs: 4, sm: 16, md: 24 }, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        zIndex: 10 
      }}>
        <IconButton 
          onClick={handleNext} 
          disabled={current === messages.length - 1} 
          size="large" 
          sx={{ 
            color: 'secondary.main',
            '&.Mui-disabled': { color: 'rgba(241, 241, 230, 0.3)' }
          }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
      </Box>
      
      {/* Message content */}
      <Box sx={{ 
        height: '100vh',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: { xs: 6, sm: 10, md: 14 },
        py: { xs: 3, sm: 4 }
      }}>
        {messages.length === 0 ? (
          <Typography 
            variant="poster" 
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            No messages yet.
          </Typography>
        ) : (
          <Fade in={fade} timeout={300}>
            <Box sx={{ 
              width: '100%',
              maxWidth: { xs: '100%', sm: '700px', md: '900px' },
              height: { xs: '90vh', sm: '85vh' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 }
            }}>
              {/* Image first - if exists */}
              {msg?.image && (
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: '0 0 auto',
                  maxHeight: { 
                    xs: msg?.content?.length > 100 ? '30vh' : '40vh',
                    sm: msg?.content?.length > 100 ? '35vh' : '45vh',
                    md: msg?.content?.length > 100 ? '40vh' : '50vh'
                  }
                }}>
                  <img 
                    src={msg.image} 
                    alt="uploaded" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain', 
                      borderRadius: 8 
                    }} 
                  />
                </Box>
              )}
              
              {/* Text section - takes remaining space */}
              <Box 
                ref={textContainerRef}
                sx={{ 
                  textAlign: 'center',
                  overflow: 'auto',
                  flex: '1 1 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 0,
                  px: { xs: 1, sm: 2 },
                  // Custom scrollbar
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(241, 241, 230, 0.3)',
                    borderRadius: '3px',
                  },
                }}
              >
                <Typography 
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontSize: getDynamicFontSize(),
                    wordBreak: 'break-word'
                  }}
                >
                  {msg?.content}
                </Typography>
              </Box>
              
              {/* Counter */}
              <Box sx={{ 
                flex: '0 0 auto', 
                textAlign: 'center',
                pt: 1
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'secondary.main',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {current + 1} / {messages.length}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}

export default ReadMessages;
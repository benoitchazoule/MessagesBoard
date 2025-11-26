import PostMessage from "./PostMessage";
import ReadMessages from "./ReadMessages";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/post" element={<PostMessage />} />
          <Route path="/read" element={<ReadMessages />} />
          <Route path="*" element={<PostMessage />} />
        </Routes>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;

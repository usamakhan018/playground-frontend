import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
    
        // Update the document title when the route changes
        useEffect(() => {
          document.title = `Your App | ${location.pathname}`;
        }, [location]);
    
  return (
    <>
    
    </>
  )
}

export default App

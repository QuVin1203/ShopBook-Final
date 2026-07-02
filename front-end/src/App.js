
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import {BrowserRouter as Router,Routes } from 'react-router-dom'

import {Toaster} from 'react-hot-toast'
import useUserRoutes from './components/routes/userRoutes';
import useAdminRoutes from './components/routes/adminRoutes'


function App() {
  const userRoutes=useUserRoutes()
  const adminRoutes=useAdminRoutes()
  return (
    <Router>
      <Toaster position='top-center'/>
    <div className='App'> 
    <Header/>
    <div classNameName="container">
      <Routes>
        {userRoutes}
        {adminRoutes}
      
      </Routes>
    
    </div>
    
    <Footer/>

    </div>
    </Router>
  );
}

export default App;

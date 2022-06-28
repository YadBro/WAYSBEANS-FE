import './assets/css/style.css';
import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Home from './pages/Home';
import DetailPage from './pages/DetailPage';
import { API } from './config/api';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import { useQuery } from 'react-query';
import { LoginContext } from './context/AuthenticatedContext';
import PrivateRoute from './PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import IsAdminRoute from './IsAdminRoute';
import TransactionPage from './pages/DashboardPages/TransactionPage';
import AddProduct from './pages/ProductPages/AddProduct';
import EditProduct from './pages/ProductPages/EditProduct';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import ComplainAdmin from './pages/ComplainAdmin';
import Complain from './pages/Complain';
import CartPage from './pages/CartPage';

function App() {
  
  const { setUser }       = useContext(UserContext);
  const { setIsLogin }    = useContext(LoginContext);
  useQuery("userCache", async () =>{
    if (localStorage.token) {
        const config    = {
            method  : "GET",
        }
        const response  = await API.get("/check-auth", config);
        setUser(response.data.data.user);
        setIsLogin(true);
    }else if(localStorage.token === undefined) {
        setUser({empty: true});
        setIsLogin(false);
    }
  });
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route exact path='/' element={<PrivateRoute />}>
        <Route path='/product-detail/:id' element={<DetailPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/update-profile/:id' element={<UpdateProfilePage />} />
        <Route path='/complain' element={<Complain />} />
        <Route path='/mycart' element={<CartPage />} />

        <Route exact path='/' element={<IsAdminRoute />}>
          <Route path='/complain-admin' element={<ComplainAdmin />} />
          <Route path='/dashboard' element={<DashboardPage />}/>
          <Route path='/dashboard/add-product' element={<AddProduct />} />
          <Route path='/dashboard/edit-product/:id' element={<EditProduct />} />
          <Route path='/transaction' element={<TransactionPage />}/>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;

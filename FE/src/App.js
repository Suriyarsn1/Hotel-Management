import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import AuthProvider from './context/authContexts';

// User Module
import Login from './components/login';
import Register from './components/register';


// Admin Modules
import Admin from './components/admin';


// Styles
import './App.css';
import CookBoard from './components/cookingpage';
import SalesAnalytics from './components/oderAnalize';
import MenuItemForm from './components/menuitem';
import MenuManagementPage from './components/menulist';
import IngredientManagement from './components/IngredientManagement';
import UserMenuPage from './components/userboard';
import PaymentPage from './components/payment';
import TableQRManager from './components/tablemanagement';
import OrderOverview from './components/orderOverview';
import CookOrderView from './components/cookingpage';
import KitchenViewBoard from './components/orderviewboard';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>




        <Routes>
          {/* User Routes */}

          <Route path='/' element={<Login />} />
          <Route path='/user/register' element={<Register />} />

          <Route path='/cook/dashboard' element={<CookOrderView />} />
          <Route path='/ingrident' element={<IngredientManagement />} />
           <Route path='/user/menu' element={<UserMenuPage />} />
          <Route path='/add/menu' element={<MenuManagementPage />} />
          <Route path='/menu/item' element={<MenuItemForm />} />
          <Route path='/admin/menu' element={<MenuItemForm />} />
           <Route path='/payment' element={<PaymentPage/>} />
          <Route path='/admin/oder/analytics' element={<SalesAnalytics />} />
          <Route path='/admin/home' element={<Admin />} />
          <Route path='/table/management' element={<TableQRManager />} />
          <Route path='/oder/overview' element={<OrderOverview />} />
          <Route path='/oder/dashboard' element={<KitchenViewBoard />} />




        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

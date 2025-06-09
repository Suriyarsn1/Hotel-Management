import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Provider
import AuthProvider from './context/authContexts';
import IngredientProvider from './context/ingridentContext';
import MenuCardProvider from './context/menuCardContext';

// User Module
import Login from './pages/login';
import Register from './pages/register';

// Admin Modules
import Admin from './pages/admin';

// Pages
import SalesAnalytics from './pages/orderAnalytics';
import MenuItemForm from './pages/menuitem';
import MenuManagementPage from './pages/menulist';
import IngredientManagement from './pages/IngredientManagement';
import UserMenuPage from './pages/userboard';
import PaymentPage from './pages/payment';
import TableQRManager from './pages/tablemanagement';
import OrderOverview from './pages/orderOverview';
import CookOrderView from './pages/cookingpage';
import KitchenViewBoard from './pages/orderviewboard';

// Styles
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuCardProvider>
          <IngredientProvider>
            <Routes>
              {/* User Routes */}
              <Route path='/' element={<Login />} />
              <Route path='/user/register' element={<Register />} />

              {/* Cook Dashboard */}
              <Route path='/cook/dashboard' element={<CookOrderView />} />

              {/* Ingredient Management */}
              <Route path='/ingredient' element={<IngredientManagement />} />

              {/* User Menu */}
              <Route path='/user/menu' element={<UserMenuPage />} />

              {/* Menu Management */}
              <Route path='/add/menu' element={<MenuManagementPage />} />
              <Route path='/menu/item' element={<MenuItemForm />} />
              <Route path='/admin/menu' element={<MenuItemForm />} />

              {/* Payment */}
              <Route path='/payment' element={<PaymentPage />} />

              {/* Admin Analytics */}
              <Route path='/admin/order/analytics' element={<SalesAnalytics />} />
              <Route path='/admin/home' element={<Admin />} />

              {/* Table Management */}
              <Route path='/table/management' element={<TableQRManager />} />

              {/* Order Overview */}
              <Route path='/order/overview' element={<OrderOverview />} />
              <Route path='/order/dashboard' element={<KitchenViewBoard />} />
            </Routes>
          </IngredientProvider>
        </MenuCardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

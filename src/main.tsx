import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheets/index.css'
import App from './App.tsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

import HomePage from './components/HomePage.tsx'
import Error from './components/Error.tsx'
import Logout from './components/Logout.tsx'
import AdminInventoryPage from './components/AdminInventoryPage.tsx'
import UserShipmentPage from './pages/UserShipmentPage.tsx'
import AdminShipmentPage from './pages/AdminShipmentPage.tsx'

import OrderListPage from './components/OrderListPage.tsx'
import AdminOrderManagementPage from './pages/adminOrders.tsx'
import PlaceOrderPage from './pages/PlaceOrderPage.tsx'
import ShipmentDetails from './components/ShipmentDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={ <App />} />
    <Route path='/home' element={ <HomePage />} />
    <Route path='/admin-dashboard' element={<AdminInventoryPage/>}/>
    <Route path='/admin-inventory' element={<AdminInventoryPage/>}/>
    <Route path='/error' element={ <Error />} />
    <Route path='/logout' element={ <Logout />} />
    <Route path="/shipment" element={<UserShipmentPage/>} />
    <Route path="/admin/shipment" element={<AdminShipmentPage />} />
    <Route path="/admin/order" element={<AdminOrderManagementPage/>}/>
     <Route path="/admin/shipment-details" element={<ShipmentDetails isAdmin={true} />} />
    <Route path="/place-order" element={<PlaceOrderPage />}/>
    <Route path="/my-orders" element={<OrderListPage />}/>
   </Routes>
   </BrowserRouter>
  </StrictMode>,
)

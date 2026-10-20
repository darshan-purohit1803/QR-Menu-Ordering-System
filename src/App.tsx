import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CustomerMenuPage } from './pages/CustomerMenuPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { StaffDashboardPage } from './pages/StaffDashboardPage'
import { PresenterBar } from './components/common/PresenterBar'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Default redirect to Table 07 customer menu */}
          <Route path="/" element={<Navigate to="/menu?table=07" replace />} />
          
          {/* Customer Menu with query param ?table=07 or ?table=08 */}
          <Route path="/menu" element={<CustomerMenuPage />} />

          {/* Customer Order Confirmation */}
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* Restaurant Staff & Kitchen Dashboard */}
          <Route path="/staff" element={<StaffDashboardPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/menu?table=07" replace />} />
        </Routes>

        {/* Floating demo switcher for sales presentation */}
        <PresenterBar />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App


import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { TenantProvider } from './providers/tenantProvider';
import { Header } from './components/header';
import { Sidebar } from './components/Sidebar';
import { TenantLoginPage } from './pages/tenantLogin';
import { DashboardPage } from "./pages/dashboard";
import { CustomersPage } from "./pages/customers";
import { ProductsPage } from "./pages/products";
import { OrdersPage } from "./pages/orders";
import { EventsPage } from "./pages/events";

function App() {
    return (
        <TenantProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/tenant-login" element={<TenantLoginPage />} />
                    <Route path="/*" element={
                        <div className="min-h-screen bg-gray-50">
                            <Header />
                            <div className="flex">
                                <Sidebar />
                                <main className="flex-1">
                                    <Routes>
                                        <Route index element={<DashboardPage />} />
                                        <Route path="customers" element={<CustomersPage />} />
                                        <Route path="products" element={<ProductsPage />} />
                                        <Route path="orders" element={<OrdersPage />} />
                                        <Route path="events" element={<EventsPage />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </TenantProvider>
    );
};

export default App;

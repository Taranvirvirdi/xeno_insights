import { useState, useEffect } from "react";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { Modal } from "../components/ui/Modal";

export const CustomersPage = () => {
    const TENANT_ID = 1; // hardcoded for now
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        shopify_customer_id: "",
        first_name: "",
        last_name: "",
        email: "",
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/customersfront?tenant_id=${TENANT_ID}`);
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/customersfront`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, tenant_id: TENANT_ID }),
            });
            const newCustomer = await res.json();
            setCustomers([...customers, newCustomer]);
            setShowModal(false);
            setFormData({ shopify_customer_id: "", first_name: "", last_name: "", email: "" });
        } catch (error) {
            console.error("Failed to create customer:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Customer
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4">ID</th>
                                <th className="text-left p-4">Name</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Created</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(customers) && customers.map((customer) => (
                                <tr key={customer.id} className="border-b">
                                    <td className="p-4">{customer.shopify_customer_id}</td>
                                    <td className="p-4">{customer.first_name} {customer.last_name}</td>
                                    <td className="p-4">{customer.email}</td>
                                    <td className="p-4">{new Date(customer.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-800"><Eye size={16} /></button>
                                            <button className="text-gray-600 hover:text-gray-800"><Edit size={16} /></button>
                                            <button className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Customer">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Shopify Customer ID</label>
                            <input
                                type="number"
                                value={formData.shopify_customer_id}
                                onChange={(e) => setFormData({ ...formData, shopify_customer_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Create Customer
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

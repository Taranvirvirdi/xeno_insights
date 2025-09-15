import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Modal } from "../components/ui/Modal";

export const OrdersPage = () => {
  const TENANT_ID = 1; // hardcoded tenant
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    shopify_order_id: "",
    customer_id: "",
    total_price: "",
    currency: "USD",
    order_date: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ordersfront`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ordersfront`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });
      const newOrder = await res.json();
      setOrders([...orders, newOrder]);
      setShowModal(false);
      setFormData({
        shopify_order_id: "",
        customer_id: "",
        total_price: "",
        currency: "USD",
        order_date: "",
      });
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Order
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer ID</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Currency</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-4">{order.shopify_order_id}</td>
                  <td className="p-4">{order.customer_id}</td>
                  <td className="p-4">${order.total_price}</td>
                  <td className="p-4">{order.currency}</td>
                  <td className="p-4">{new Date(order.order_date).toLocaleDateString()}</td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Order">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label>Shopify Order ID</label>
              <input
                type="number"
                value={formData.shopify_order_id}
                onChange={(e) => setFormData({ ...formData, shopify_order_id: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Customer ID</label>
              <input
                type="number"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Total Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div>
              <label>Order Date</label>
              <input
                type="datetime-local"
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Create Order
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

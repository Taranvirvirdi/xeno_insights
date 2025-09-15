import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Modal } from '../components/ui/Modal';
import { useTenant } from '../hooks/useTenant';

export const ProductsPage = () => {
    const { currentTenant } = useTenant();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        shopify_product_id: '',
        title: '',
        vendor: '',
        product_type: '',
        price: ''
    });

    useEffect(() => {
        if (currentTenant) loadProducts();
    }, [currentTenant]);

    const loadProducts = async () => {
        if (!currentTenant) return;
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productsfront`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/productsfront`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const newProduct = await res.json();
            setProducts([...products, newProduct]);
            setShowModal(false);
            setFormData({ shopify_product_id: '', title: '', vendor: '', product_type: '', price: '' });
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    if (!currentTenant) return <div className="p-6">Please select a tenant first.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Product
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
                                <th className="text-left p-4">Title</th>
                                <th className="text-left p-4">Vendor</th>
                                <th className="text-left p-4">Type</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b">
                                    <td className="p-4">{product.shopify_product_id}</td>
                                    <td className="p-4">{product.title}</td>
                                    <td className="p-4">{product.vendor}</td>
                                    <td className="p-4">{product.product_type}</td>
                                    <td className="p-4">${product.price}</td>
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Product">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label>Shopify Product ID</label>
                            <input
                                type="number"
                                value={formData.shopify_product_id}
                                onChange={(e) => setFormData({ ...formData, shopify_product_id: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label>Vendor</label>
                            <input
                                type="text"
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label>Product Type</label>
                            <input
                                type="text"
                                value={formData.product_type}
                                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Create Product
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTenant } from '../hooks/useTenant';

export const TenantLoginPage = () => {
    const { addTenant } = useTenant();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shopify_domain: '',
        access_token: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addTenant(formData);
            navigate('/customers');
        } catch (error) {
            console.error('Failed to add tenant:', error);
            alert('Failed to add tenant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Add New Tenant</h1>
                    <p className="text-gray-600 mt-2">Connect your Shopify store to get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shopify Domain
                            </label>
                            <input
                                type="text"
                                value={formData.shopify_domain}
                                onChange={(e) => setFormData({ ...formData, shopify_domain: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your-store.myshopify.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Token
                            </label>
                            <input
                                type="password"
                                value={formData.access_token}
                                onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="shppa_xxxxxxxxxxxxxxxxxx"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connecting...' : 'Connect Store'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/customers')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import { mockAPI } from '../mocks/api';
import { useTenant } from '../hooks/useTenant';
import { Modal } from '../components/ui/Modal';

export const EventsPage = () => {
    const { currentTenant } = useTenant();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        event_type: 'cart_abandoned',
        shopify_event_id: '',
        event_data: ''
    });

    useEffect(() => {
        if (currentTenant) {
            loadEvents();
        }
    }, [currentTenant]);

    const loadEvents = async () => {
        if (!currentTenant) return;

        setLoading(true);
        try {
            const data = await mockAPI.getEvents(currentTenant.id);
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const eventData = {
                ...formData,
                event_data: JSON.parse(formData.event_data || '{}')
            };
            const newEvent = await mockAPI.createEvent(currentTenant.id, eventData);
            setEvents([...events, newEvent]);
            setShowModal(false);
            setFormData({ event_type: 'cart_abandoned', shopify_event_id: '', event_data: '' });
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    if (!currentTenant) {
        return <div className="p-6">Please select a tenant first.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Event
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4">Event Type</th>
                                <th className="text-left p-4">Shopify Event ID</th>
                                <th className="text-left p-4">Event Data</th>
                                <th className="text-left p-4">Created</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b">
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {event.event_type}
                                        </span>
                                    </td>
                                    <td className="p-4">{event.shopify_event_id}</td>
                                    <td className="p-4">
                                        <code className="text-xs bg-gray-100 p-1 rounded">
                                            {JSON.stringify(event.event_data)}
                                        </code>
                                    </td>
                                    <td className="p-4">{new Date(event.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <Eye size={16} />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-800">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Event">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Type</label>
                            <select
                                value={formData.event_type}
                                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="cart_abandoned">Cart Abandoned</option>
                                <option value="checkout_started">Checkout Started</option>
                                <option value="product_viewed">Product Viewed</option>
                                <option value="search_performed">Search Performed</option>
                                <option value="email_opened">Email Opened</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Shopify Event ID</label>
                            <input
                                type="number"
                                value={formData.shopify_event_id}
                                onChange={(e) => setFormData({ ...formData, shopify_event_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Data (JSON)</label>
                            <textarea
                                value={formData.event_data}
                                onChange={(e) => setFormData({ ...formData, event_data: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                placeholder='{"cart_value": 99.99, "items_count": 2}'
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create Event
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

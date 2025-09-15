export const mockAPI = {
    baseURL: 'Using MOCK API Service...',

    // Tenants
    getTenants: async () => {
        return [
            { id: 1, shopify_domain: 'store1.myshopify.com', created_at: '2024-01-15' },
            { id: 2, shopify_domain: 'store2.myshopify.com', created_at: '2024-01-16' }
        ];
    },

    createTenant: async (data) => {
        return { id: Date.now(), ...data, created_at: new Date().toISOString() };
    },

    // Customers
    getCustomers: async (tenantId) => {
        return [
            { id: 1, shopify_customer_id: 1001, first_name: 'John', last_name: 'Doe', email: 'john@example.com', created_at: '2024-01-15' },
            { id: 2, shopify_customer_id: 1002, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', created_at: '2024-01-16' }
        ];
    },

    createCustomer: async (tenantId, data) => {
        return { id: Date.now(), tenant_id: tenantId, ...data, created_at: new Date().toISOString() };
    },

    // Products
    getProducts: async (tenantId) => {
        return [
            { id: 1, shopify_product_id: 2001, title: 'Premium T-Shirt', vendor: 'Fashion Co', product_type: 'Apparel', price: 29.99, created_at: '2024-01-15' },
            { id: 2, shopify_product_id: 2002, title: 'Wireless Headphones', vendor: 'Tech Corp', product_type: 'Electronics', price: 99.99, created_at: '2024-01-16' }
        ];
    },

    createProduct: async (tenantId, data) => {
        return { id: Date.now(), tenant_id: tenantId, ...data, created_at: new Date().toISOString() };
    },

    // Orders
    getOrders: async (tenantId) => {
        return [
            { id: 1, shopify_order_id: 3001, customer_id: 1001, total_price: 59.98, currency: 'USD', order_date: '2024-01-15', created_at: '2024-01-15' },
            { id: 2, shopify_order_id: 3002, customer_id: 1002, total_price: 129.99, currency: 'USD', order_date: '2024-01-16', created_at: '2024-01-16' }
        ];
    },

    createOrder: async (tenantId, data) => {
        return { id: Date.now(), tenant_id: tenantId, ...data, created_at: new Date().toISOString() };
    },

    // Events
    getEvents: async (tenantId) => {
        return [
            { id: 1, event_type: 'cart_abandoned', shopify_event_id: 4001, event_data: { cart_value: 99.99 }, created_at: '2024-01-15' },
            { id: 2, event_type: 'checkout_started', shopify_event_id: 4002, event_data: { items_count: 2 }, created_at: '2024-01-16' }
        ];
    },

    createEvent: async (tenantId, data) => {
        return { id: Date.now(), tenant_id: tenantId, ...data, created_at: new Date().toISOString() };
    }
};
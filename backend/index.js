import express from 'express'
import axios from 'axios';
import dotenv from 'dotenv';
import pool from './db.js';
import cors from 'cors';



dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL ||"http://localhost:5173",  // frontend URL
    credentials: true // if you use cookies/auth
}));

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME;

// Base URL
const SHOPIFY_BASE_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2025-01`;

// Dashboard stats
// server.js (Express backend)
app.get("/api/dashboard", async (req, res) => {
    try {
        const tenantId = 1; // hardcoded tenant

        const [[{ total_customers }]] = await pool.query(
            "SELECT COUNT(*) AS total_customers FROM customers WHERE tenant_id = ?",
            [tenantId]
        );
        const [[{ total_orders }]] = await pool.query(
            "SELECT COUNT(*) AS total_orders FROM orders WHERE tenant_id = ?",
            [tenantId]
        );
        const [[{ total_products }]] = await pool.query(
            "SELECT COUNT(*) AS total_products FROM products WHERE tenant_id = ?",
            [tenantId]
        );

        res.json({
            total_customers,
            total_orders,
            total_products,
            events_today: 45, // placeholder
        });
    } catch (err) {
        console.error("Dashboard stats error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get("/api/customersfront", async (req, res) => {
    try {
        const tenantId = 1; // hardcoded tenant
        const [rows] = await pool.query(
            "SELECT * FROM customers WHERE tenant_id = ?",
            [tenantId]
        );
        // rows should be an array
        res.json(Array.isArray(rows) ? rows : []);
    } catch (err) {
        console.error("Fetch customers error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get("/api/ordersfront", async (req, res) => {
    try {
        const tenantId = 1; // hardcoded tenant
        const [rows] = await pool.query(
            "SELECT * FROM orders WHERE tenant_id = ? ORDER BY order_date DESC",
            [tenantId]
        );
        res.json(rows); // send array of orders
    } catch (err) {
        console.error("Fetch orders error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get("/api/productsfront", async (req, res) => {
    try {
        const tenantId = 1; // hardcoded tenant
        const [rows] = await pool.query(
            "SELECT * FROM products WHERE tenant_id = ? ORDER BY id DESC",
            [tenantId]
        );
        res.json(Array.isArray(rows) ? rows : []);
    } catch (err) {
        console.error("Fetch products error:", err.message);
        res.status(500).json({ error: err.message });
    }
});



app.get("/api/tenant", async (req, res) => {
    try {
        const { data } = await axios.get(`${SHOPIFY_BASE_URL}/shop.json`, {
            headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN },
        });

        const shop = data.shop;

        // Insert tenant into DB
        await pool.query(
            `INSERT INTO tenants (shopify_domain, access_token) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE access_token = ?`,
            [shop.myshopify_domain, SHOPIFY_ACCESS_TOKEN, SHOPIFY_ACCESS_TOKEN]
        );

        res.json(shop);
    } catch (error) {
        console.error("Tenant insert error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Products
app.get("/api/products", async (req, res) => {
    try {
        const { data } = await axios.get(`${SHOPIFY_BASE_URL}/products.json`, {
            headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN },
        });

        const [tenantRows] = await pool.query(
            `SELECT id FROM tenants WHERE shopify_domain = ?`,
            [process.env.SHOPIFY_STORE_NAME + ".myshopify.com"]
        );
        const tenantId = tenantRows[0].id;

        for (const p of data.products) {
            const price = p.variants && p.variants.length > 0 ? p.variants[0].price : null;

            await pool.query(
                `INSERT INTO products (tenant_id, shopify_product_id, title, body_html, vendor, product_type, price) 
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=?, body_html=?, vendor=?, product_type=?, price=?`,
                [
                    tenantId,
                    p.id,
                    p.title,
                    p.body_html,
                    p.vendor,
                    p.product_type,
                    price,
                    p.title,
                    p.body_html,
                    p.vendor,
                    p.product_type,
                    price,
                ]
            );
        }

        res.json({ message: "Products inserted/updated", count: data.products.length });
    } catch (error) {
        console.error("Products insert error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Customers
app.get("/api/customers", async (req, res) => {
    try {
        const { data } = await axios.get(`${SHOPIFY_BASE_URL}/customers.json`, {
            headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN },
        });

        // Get tenant id from DB (based on shopify_domain)
        const [tenantRows] = await pool.query(
            `SELECT id FROM tenants WHERE shopify_domain = ?`,
            [process.env.SHOPIFY_STORE_NAME + ".myshopify.com"]
        );
        const tenantId = tenantRows[0].id;

        for (const c of data.customers) {
            await pool.query(
                `INSERT INTO customers (tenant_id, shopify_customer_id, first_name, last_name, email) 
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE first_name=?, last_name=?, email=?`,
                [
                    tenantId,
                    c.id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    c.first_name,
                    c.last_name,
                    c.email,
                ]
            );
        }

        res.json({ message: "Customers inserted/updated", count: data.customers.length });
    } catch (error) {
        console.error("Customers insert error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Orders API
app.get("/api/orders", async (req, res) => {
    try {
        const { data } = await axios.get(`${SHOPIFY_BASE_URL}/orders.json`, {
            headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN },
        });

        // Get tenant_id
        const [tenantRows] = await pool.query(
            `SELECT id FROM tenants WHERE shopify_domain = ?`,
            [process.env.SHOPIFY_STORE_NAME + ".myshopify.com"]
        );
        const tenantId = tenantRows[0].id;

        for (const o of data.orders) {
            let customerId = null;

            if (o.customer) {
                // Insert or update customer (with tenant_id)
                await pool.query(
                    `INSERT INTO customers (tenant_id, shopify_customer_id, first_name, last_name, email)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE first_name=?, last_name=?, email=?`,
                    [
                        tenantId,
                        o.customer.id,
                        o.customer.first_name,
                        o.customer.last_name,
                        o.customer.email,
                        o.customer.first_name,
                        o.customer.last_name,
                        o.customer.email,
                    ]
                );

                // Get local customer.id
                const [customerRow] = await pool.query(
                    `SELECT id FROM customers WHERE shopify_customer_id = ? AND tenant_id = ?`,
                    [o.customer.id, tenantId]
                );
                customerId = customerRow[0]?.id || null;
            }

            // Insert or update order
            await pool.query(
                `INSERT INTO orders (tenant_id, shopify_order_id, customer_id, total_price, currency, order_date) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE customer_id=?, total_price=?, currency=?, order_date=?`,
                [
                    tenantId,
                    o.id,
                    customerId,
                    o.total_price,
                    o.currency,
                    o.created_at,
                    customerId,
                    o.total_price,
                    o.currency,
                    o.created_at,
                ]
            );
        }

        res.json({ message: "Orders + Customers synced", count: data.orders.length });
    } catch (error) {
        console.error("Orders insert error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create dummy customer
app.post('/api/customers/create-customers', async (req, res) => {
    const dummyCustomer = req.body;
    console.log(dummyCustomer);

    try {
        const response = await axios.post(`${SHOPIFY_BASE_URL}/customers.json`, dummyCustomer, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        console.log("Customer created:", response.data.customer);
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
});


app.post('/api/order/create-order', async (req, res) => {
    const dummyCustomer = req.body;
    console.log(dummyCustomer);

    try {
        const response = await axios.post(`${SHOPIFY_BASE_URL}/orders.json`, dummyCustomer, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        console.log("Order created:", response.data.customer);
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


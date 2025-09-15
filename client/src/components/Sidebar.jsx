import { Link } from 'react-router-dom';

import {
    Users,
    ShoppingCart,
    Package,
    Activity,
    Home,
} from 'lucide-react';

export const Sidebar = () => {
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/orders' },
        { icon: Activity, label: 'Events', path: '/events' },
    ];

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

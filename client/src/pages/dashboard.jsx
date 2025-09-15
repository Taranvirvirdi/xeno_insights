import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Package, Activity, Store } from "lucide-react";


export const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard`); // tenant_id is hardcoded in backend
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  const statCards = [
    { label: "Total Customers", value: stats.total_customers, icon: Users },
    { label: "Total Orders", value: stats.total_orders, icon: ShoppingCart },
    { label: "Total Products", value: stats.total_products, icon: Package },
    { label: "Events Today", value: stats.events_today, icon: Activity },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Tenant 1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/customers"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <span className="font-medium">Manage Customers</span>
                    </Link>
                    <Link
                        to="/products"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Package className="h-8 w-8 text-green-600 mr-3" />
                        <span className="font-medium">Manage Products</span>
                    </Link>
                    <Link
                        to="/orders"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ShoppingCart className="h-8 w-8 text-orange-600 mr-3" />
                        <span className="font-medium">View Orders</span>
                    </Link>
                    <Link
                        to="/events"
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Activity className="h-8 w-8 text-purple-600 mr-3" />
                        <span className="font-medium">Track Events</span>
                    </Link>
                </div>
            </div>

    </div>
  );
};

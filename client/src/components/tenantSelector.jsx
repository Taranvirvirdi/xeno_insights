import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ChevronDown, Plus } from "lucide-react";

import { useTenant } from "../hooks/useTenant";

export const TenantSelector = () => {
    const { currentTenant, tenants, switchTenant } = useTenant();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <Store size={16} />
                <span className="text-sm font-medium">
                    {currentTenant ? currentTenant.shopify_domain : 'Select Tenant'}
                </span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        {tenants.map((tenant) => (
                            <button
                                key={tenant.id}
                                onClick={() => {
                                    switchTenant(tenant);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 ${currentTenant?.id === tenant.id ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                            >
                                {tenant.shopify_domain}
                            </button>
                        ))}
                        <hr className="my-2" />
                        <button
                            onClick={() => {
                                navigate('/tenant-login');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-green-600"
                        >
                            <Plus size={16} className="inline mr-2" />
                            Add New Tenant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

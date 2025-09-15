import { Link } from 'react-router-dom';
import { TenantSelector } from './tenantSelector';
import { Settings } from 'lucide-react';

export const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            <Link to={'/'}>
                                Shopify Insights
                            </Link>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <TenantSelector />
                        <button className="p-2 text-gray-400 hover:text-gray-500">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

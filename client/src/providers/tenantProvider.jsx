import { useEffect, useState } from "react";
import { mockAPI } from '../mocks/api';
import { tenantContext } from '../hooks/useTenant';

export const TenantProvider = ({ children }) => {
    const [currentTenant, setCurrentTenant] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        try {
            const tenantsData = await mockAPI.getTenants();
            setTenants(tenantsData);
            if (tenantsData.length > 0 && !currentTenant) {
                setCurrentTenant(tenantsData[0]);
            }
        } catch (error) {
            console.error('Failed to load tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const switchTenant = (tenant) => {
        setCurrentTenant(tenant);
    };

    const addTenant = async (tenantData) => {
        try {
            const newTenant = await mockAPI.createTenant(tenantData);
            setTenants([...tenants, newTenant]);
            setCurrentTenant(newTenant);
            return newTenant;
        } catch (error) {
            console.error('Failed to create tenant:', error);
            throw error;
        }
    };

    return (
        <tenantContext.Provider value={{
            currentTenant,
            tenants,
            switchTenant,
            addTenant,
            loading
        }}>
            {children}
        </tenantContext.Provider>
    );
};

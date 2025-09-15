import { createContext, useContext } from "react";

export const tenantContext = createContext();

export const useTenant = () => {
    const context = useContext(tenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteName: 'Vagwiin',
        contactEmail: 'support@vagwiin.com',
        contactPhone: '+91 1234567890',
        address: '123 Business Park, Sector 62, Noida, UP',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        maintenanceMode: false,
        homepageBannerText: 'Welcome to Vagwiin - Your Premium Heritage Partner',
        currency: 'INR'
    });
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const response = await settingsService.getSettings();
            if (response.status === 'success') {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    const getCurrencySymbol = () => {
        switch (settings.currency) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR':
            default: return '₹';
        }
    };

    const currencySymbol = getCurrencySymbol();
    const currencyCode = settings.currency;

    const formatPrice = (amount) => {
        return `${currencySymbol}${Number(amount || 0).toLocaleString()}`;
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings, currencySymbol, currencyCode, formatPrice }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import authService from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user) {
                const response = await cartService.getCart();
                if (response.status === 'success') {
                    setCart(response.data.cart);
                }
            } else {
                setCart(null);
            }
        } catch (error) {
            // If 404, it might mean cart doesn't exist for user yet, which is fine
            if (error.response?.status === 404) {
                setCart(null);
            } else {
                console.error('Error fetching cart:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Listen for storage changes (for login/logout across tabs)
    useEffect(() => {
        const handleStorageChange = () => {
            fetchCart();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                return { success: false, message: 'Please login to add items to cart' };
            }
            const response = await cartService.addToCart(productId, quantity);
            if (response.status === 'success') {
                setCart(response.data.cart || response.data.data?.cart);
                return { success: true };
            }
            return { success: false, message: response.message || 'Failed to add to cart' };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error adding to cart'
            };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await cartService.removeFromCart(productId);
            if (response.status === 'success') {
                setCart(response.data.cart || response.data.data?.cart);
                return { success: true };
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await cartService.updateQuantity(productId, quantity);
            if (response.status === 'success') {
                setCart(response.data.cart || response.data.data?.cart);
                return { success: true };
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            return { success: false };
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartService.clearCart();
            if (response.status === 'success') {
                setCart(null);
                return { success: true };
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false };
        }
    };

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const value = {
        cart,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

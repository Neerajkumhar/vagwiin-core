import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import authService from '../services/authService';
import productService from '../services/productService';

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
                // Load guest cart from localStorage
                const localCart = localStorage.getItem('guest_cart');
                if (localCart) {
                    setCart(JSON.parse(localCart));
                } else {
                    setCart(null);
                }
            }
        } catch (error) {
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
            if (user) {
                const response = await cartService.addToCart(productId, quantity);
                if (response.status === 'success') {
                    setCart(response.data.cart || response.data.data?.cart);
                    return { success: true };
                }
                return { success: false, message: response.message || 'Failed to add to cart' };
            } else {
                // Handle guest cart
                let currentCart = cart ? JSON.parse(JSON.stringify(cart)) : { items: [] };
                if (!currentCart.items) currentCart.items = [];

                const existingItemIndex = currentCart.items.findIndex(item => item.product._id === productId);

                if (existingItemIndex > -1) {
                    currentCart.items[existingItemIndex].quantity += quantity;
                } else {
                    // Fetch product details for guest cart
                    const productResponse = await productService.getProductById(productId);
                    if (productResponse.status === 'success') {
                        currentCart.items.push({
                            product: productResponse.data.product,
                            quantity: quantity
                        });
                    } else {
                        return { success: false, message: 'Failed to fetch product details' };
                    }
                }

                const updatedCart = { ...currentCart };
                setCart(updatedCart);
                localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
                return { success: true };
            }
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
            const user = authService.getCurrentUser();
            if (user) {
                const response = await cartService.removeFromCart(productId);
                if (response.status === 'success') {
                    setCart(response.data.cart || response.data.data?.cart);
                    return { success: true };
                }
            } else {
                const updatedItems = cart.items.filter(item => item.product._id !== productId);
                const updatedCart = { ...cart, items: updatedItems };
                setCart(updatedCart);
                localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
                return { success: true };
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        try {
            const user = authService.getCurrentUser();
            if (user) {
                const response = await cartService.updateQuantity(productId, quantity);
                if (response.status === 'success') {
                    setCart(response.data.cart || response.data.data?.cart);
                    return { success: true };
                }
            } else {
                const updatedItems = cart.items.map(item =>
                    item.product._id === productId ? { ...item, quantity } : item
                );
                const updatedCart = { ...cart, items: updatedItems };
                setCart(updatedCart);
                localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
                return { success: true };
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            return { success: false };
        }
    };

    const clearCart = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user) {
                const response = await cartService.clearCart();
                if (response.status === 'success') {
                    setCart(null);
                    return { success: true };
                }
            } else {
                setCart(null);
                localStorage.removeItem('guest_cart');
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

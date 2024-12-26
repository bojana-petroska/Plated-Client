'use client';
import { IOrderItem } from '@/types';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface CartContextProps {
  cart: IOrderItem[];
  totalQuantity: number;
  addToCart: (menuItem: IOrderItem) => void;
  updateItemQuantity: (id: number, action: 'increase' | 'decrease') => void;
  showModal: boolean;
  itemToDelete: IOrderItem | null;
  confirmDelete: (confirm: boolean) => void;
  cancelDelete: () => void;
}

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<IOrderItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IOrderItem | null>(null);

  const addToCart = (menuItem: IOrderItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.menuItem?.menuItem_id === menuItem.menuItem?.menuItem_id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + menuItem.quantity }
            : item
        );
        return updatedCart;
      } else {
        return [...prevCart, menuItem];
      }
    });
  };

  const updateItemQuantity = (
    id: number | undefined,
    action: 'increase' | 'decrease'
  ) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.menuItem?.menuItem_id === id
          ? {
              ...item,
              quantity:
                action === 'increase'
                  ? item.quantity + 1
                  : item.quantity - 1,
            }
          : item
      );

      if (action === 'decrease') {
        const item = updatedCart.find((i) => i.menuItem?.menuItem_id === id);
        if (item && item.quantity === 0) {
          setItemToDelete(item);
          setShowModal(true);
          return prevCart;
        }
      }

      return updatedCart;
    });
  };

  const totalQuantity = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const confirmDelete = (confirm: boolean) => {
    if (confirm && itemToDelete) {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            item.menuItem?.menuItem_id !== itemToDelete.menuItem?.menuItem_id
        )
      );
    }
    cancelDelete();
  };

  const cancelDelete = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    console.log('Updated Cart:', cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity,
        addToCart,
        updateItemQuantity,
        showModal,
        itemToDelete,
        confirmDelete,
        cancelDelete,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

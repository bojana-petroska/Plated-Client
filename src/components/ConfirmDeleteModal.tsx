'use client';
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/Buttons';

const ConfirmDeleteModal: React.FC = () => {
  const { showModal, itemToDelete, confirmDelete, cancelDelete } = useCart();

  if (!showModal || !itemToDelete) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96 text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this item?
        </h3>
        <p className="text-gray-700 mb-6">{itemToDelete.menuItem?.name}</p>
        <div className="flex justify-between gap-4">
          <Button
            onClick={() => {
              confirmDelete(true);
              cancelDelete();
            }}
            type="pink"
            size="small">
            Yes
          </Button>
          <Button
            onClick={() => {
              cancelDelete();
            }}
            type="white"
            size="small">
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

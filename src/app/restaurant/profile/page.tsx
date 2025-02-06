'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IRestaurant } from '@/types';
import axiosInstance from '../../../services/api/axiosInstance';
import NavbarRestaurant from '@/components/NavbarRestaurant';
import useClickOutside from '@/hooks/useClickOutside';
import { useRestaurant } from '@/contexts/RestaurantContext';

const RestaurantProfilePage = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const editRef = useRef<HTMLDivElement>(null);

  const { restaurant_id } = useRestaurant();

  useClickOutside(editRef, (e) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsEditing(false);
  });

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axiosInstance.get(
          `/restaurants/${restaurant_id}/own`
        );
        console.log('RESPONSE:', response.data);
        setRestaurant(response.data);
        setFormData({
          name: response.data.name || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
          email: response.data.email || '',
        });
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error);
        localStorage.removeItem('authToken');
        alert('Session expired. Please log in again.');
        router.push('/restaurant/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!restaurant) {
      alert('Restaurant data is not loaded yet.');
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/restaurants/${restaurant?.restaurant_id}`,
        formData
      );
      setFormData(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-[#A5C5DF] flex-col justify-between px-4 pt-6 font-montserrat">
      <div className="w-full max-w-md mx-auto rounded-xl p-3">
        <div className="flex items-end mb-6">
          <h1 className="text-2xl text-[#323232]">Restaurant Profile</h1>
        </div>
        <div className="bg-white rounded-lg p-4 space-y-4 w-full" ref={editRef}>
          {['name', 'email', 'address', 'phoneNumber'].map((field) => (
            <div
              key={field}
              className={`flex justify-between items-center ${field === 'phoneNumber' ? '' : 'border-b-[0.3px] border-[#323232] pb-2'} overflow-auto`}>
              <span className="text-[#323232] capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </span>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="text-gray-500 text-right bg-transparent focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300 border-none">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300 border-none">
              Save Changes
            </button>
          )}
        </div>
        <div className="mt-4 bg-white rounded-lg p-4 space-y-2">
          <div
            className="cursor-pointer border-b-[0.3px] border-[#323232] pb-2 text-gray-800"
            onClick={() => localStorage.removeItem('authToken')}>
            Log Out
          </div>
          <div className="cursor-pointer">Delete Account</div>
        </div>
      </div>
      <NavbarRestaurant />
    </div>
  );
};

export default RestaurantProfilePage;

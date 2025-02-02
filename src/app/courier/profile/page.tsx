'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ICourier } from '@/types';
import axiosInstance from '../../../services/api/axiosInstance';
import NavbarCourier from '@/components/NavbarCourier';
import useClickOutside from '@/hooks/useClickOutside';

const CourierProfilePage = () => {
  const router = useRouter();
  const [courier, setCourier] = useState<ICourier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const editRef = useRef<HTMLDivElement>(null);
  const courier_id = localStorage.getItem('courierId')

  useClickOutside(editRef, (e) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsEditing(false);
  });

  useEffect(() => {
    const fetchCourierData = async () => {
      try {
        const response = await axiosInstance.get(`/courier/${courier_id}`);
        console.log('RESPONSE:', response.data)
        setCourier(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
        });
      } catch (error) {
        console.error('Failed to fetch courier data:', error);
        // localStorage.removeItem('authToken');
        alert('Session expired. Please log in again.');
        router.push('/courier/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchCourierData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!courier) {
      alert('Courier data is not loaded yet.');
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/courier/${courier?.courier_id}`,
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
    <div className="min-h-screen flex bg-white flex-col justify-between px-4 pt-6 font-montserrat">
      <div className="w-full max-w-md mx-auto rounded-xl p-3">
        <div className="flex items-end mb-6">
          <h1 className="text-2xl text-[#323232]">Courier Profile</h1>
        </div>
        <div className="bg-[#F8F8F8] rounded-lg p-4 space-y-4" ref={editRef}>
          {[ 'name', 'email', 'address', 'phoneNumber'].map((field) => (
            <div
              key={field}
              className={`flex justify-between items-center ${field === 'phoneNumber' ? '' : 'border-b-[0.3px] border-[#323232] pb-2'}`}>
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
            className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300">
              Save Changes
            </button>
          )}
        </div>
        <div className="mt-4 bg-[#F8F8F8] rounded-lg p-4 space-y-2">
          <div
            className="cursor-pointer border-b-[0.3px] border-[#323232] pb-2 text-gray-800"
            onClick={() => localStorage.removeItem('authToken')}>
            Log Out
          </div>
          <div className="cursor-pointer">Delete Account</div>
        </div>
      </div>
      <NavbarCourier />
    </div>
  );
};

export default CourierProfilePage;

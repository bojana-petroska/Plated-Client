'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setUser(response.data);
        setUserData(response.data);
        setFormData({ ...response.data });
        console.log('RESPONSE', response.data)
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('authToken');
        alert('Session expired. Please log in again.');
        router.push('/user/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!user) {
      alert('User data is not loaded yet.');
      return;
    }

    try {
      const response = await axiosInstance.put(`/users/${user?.user_id}`, formData);
      setUserData(response.data);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 pt-6">
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="/img/logo.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="absolute top-0 right-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white border-2 border-gray-300 p-1 rounded-full"
              >
                <img src="/img/logo.jpg" alt="Edit" className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-gray-800">My Account</h1>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Username</span>
            <input
              type="text"
              name="userName"
              value={formData.userName || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">First name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Last name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Address</span>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Phone Number</span>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`text-gray-800 font-medium ${isEditing ? 'border-b' : ''}`}
            />
          </div>
        </div>
        <div className="mt-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import axiosInstance from '../../../services/api/axiosInstance';
import NavbarUser from '@/components/NavbarUser';
import ImageUploader from '@/components/ImageUploader';
import useClickOutside from '@/hooks/useClickOutside';
import { useUser } from '@/contexts/UserContext';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const editRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState(false);

  const { user_id } = useUser();

  useClickOutside(editRef, (e) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsEditing(false);
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) return;

      try {
        const response = await axiosInstance.get(`/users/${user_id}`);
        console.log('This is the user:', response.data);
        setUser(response.data);
        setFormData({
          userName: response.data.userName || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
          email: response.data.email || '',
        });
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
  }, [router, user_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    console.log('handleSave triggered');
    if (!user_id) {
      alert('User data is not loaded yet.');
      return;
    }

    console.log('Sending form data:', formData);

    try {
      const response = await axiosInstance.put(`/users/${user_id}`, formData);
      setFormData(response.data);
      setIsEditing(false);
      setTimeout(() => {
        setAlerts(true);
        setTimeout(() => {
          setAlerts(false);
        }, 1500);
      });
      // setAlerts(true)
      // alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleImageUpdate = (imageUrl: string) => {
    setUser((prev) => ({
      ...prev,
      profilePicture: imageUrl,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/user/auth/signin');
  };

  return (
    <div className="min-h-screen flex bg-white flex-col justify-between px-4 pt-6 font-montserrat">
      <div className="w-full max-w-md mx-auto rounded-xl p-3">
        <div className="flex items-end mb-6">
          <h1 className="text-xl text-[#323232]">My Account</h1>
          <div className="relative ml-auto text-center">
            <ImageUploader
              userId={user_id || 0}
              currentImage={user?.profilePicture || null}
              onImageUpdate={handleImageUpdate}
            />
          </div>
        </div>
        <div
          className="text-sm bg-[#F8F8F8] rounded-lg p-4 space-y-4"
          ref={editRef}>
          {[
            'userName',
            'firstName',
            'lastName',
            'email',
            'address',
            'phoneNumber',
          ].map((field) => (
            <div
              key={field}
              className={`w-full flex justify-between items-center ${field === 'phoneNumber' ? '' : 'border-b-[0.3px] border-[#323232] pb-2'}`}>
              <span className="text-[#323232] capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </span>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`text-gray-500 text-right bg-transparent focus:outline-none ${
                  field === 'email' ? 'w-[250px]' : 'w-[150px]'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Button clicked!!!');
                handleSave();
              }}
              className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300 text-sm">
              Save Changes
            </button>
          )}
        </div>
        <div className="mt-4 bg-[#F8F8F8] rounded-lg p-4 space-y-2">
          <div
            className="text-sm cursor-pointer border-b-[0.3px] border-[#323232] pb-2 text-gray-800"
            onClick={handleLogout}>
            Log Out
          </div>
          <div className="cursor-pointer text-sm">Delete Account</div>
        </div>
      </div>
      <div className="mt-40">
        {alerts && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FF7F7F] text-white text-center p-4 rounded-xl z-50">
            Profile updated successfully!
          </div>
        )}
        <NavbarUser />
      </div>
    </div>
  );
};

export default ProfilePage;

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
        console.log('This is the user:', response.data)
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
      const response = await axiosInstance.put(
        `/users/${user_id}`,
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

  const handleImageUpdate = (imageUrl: string) => {
    setUser((prev) => ({
      ...prev,
      profilePicture: imageUrl,
    }));
  };

  return (
    <div className="min-h-screen flex bg-white flex-col justify-between px-4 pt-6 font-montserrat">
      <div className="w-full max-w-md mx-auto rounded-xl p-3">
        <div className="flex items-end mb-6">
          <h1 className="text-2xl text-[#323232]">My Account</h1>
          <div className="relative ml-auto text-center">
            <ImageUploader
              userId={user_id || 0}
              currentImage={user?.profilePicture || null}
              onImageUpdate={handleImageUpdate}
            />
          </div>
        </div>
        <div className="bg-[#F8F8F8] rounded-lg p-4 space-y-4" ref={editRef}>
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
                className="w-[250px] text-gray-500 text-right bg-transparent focus:outline-none"
                // onInput="this.style.width = ((this.value.length + 1) * 8) + 'px'"
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
                console.log('Button clicked!!!');
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
      <NavbarUser />
    </div>
  );
};

export default ProfilePage;

'use client';
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../services/api/axiosInstance';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import NavbarUser from '@/components/NavbarUser';

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
  const editRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
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
      const response = await axiosInstance.put(
        `/users/${user?.user_id}`,
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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (editRef.current && !editRef.current.contains(e.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white flex-col justify-between px-4 pt-6 font-montserrat">
      <div className="w-full max-w-md mx-auto rounded-xl p-3">
        {/* Header Section */}
        <div className="flex items-end mb-6">
          <h1 className="text-2xl text-[#323232]">My Account</h1>
          <div className="relative ml-auto text-center">
            <img
              src="/img/dessert.png"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <span
              className="text-sm text-[#323232] underline cursor-pointer mt-4 block"
              onClick={() => setIsEditing(true)}>
              edit
            </span>
            <div className="absolute top-0 right-0">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.2633 6.69043H5.41667C4.21958 6.69043 3.25 7.71851 3.25 8.98493V20.4553C3.25 21.7228 4.21958 22.7498 5.41667 22.7498H17.3333C18.5304 22.7498 19.5 21.7228 19.5 20.4553V12.0594L15.2598 16.5488C14.8896 16.9447 14.4073 17.2183 13.8775 17.3331L10.9731 17.9484C9.07725 18.3493 7.40675 16.5802 7.78592 14.5738L8.36658 11.4983C8.47167 10.9436 8.7295 10.4333 9.10758 10.0336L12.2633 6.69043Z"
                  fill="#FF7F7F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4998 4.67777C21.3903 4.40047 21.2297 4.14618 21.0264 3.92811C20.8265 3.71483 20.5855 3.54421 20.3179 3.42652C20.0543 3.31075 19.7695 3.25098 19.4816 3.25098C19.1937 3.25098 18.9089 3.31075 18.6452 3.42652C18.3777 3.54421 18.1367 3.71483 17.9367 3.92811L17.3452 4.55427L20.4349 7.82594L21.0264 7.19869C21.2319 6.98227 21.3927 6.72754 21.4998 6.44902C21.723 5.87969 21.723 5.2471 21.4998 4.67777ZM18.9042 9.44769L15.8134 6.17494L10.6383 11.6566C10.562 11.738 10.5105 11.8394 10.4899 11.9491L9.90925 15.0258C9.83342 15.4266 10.1682 15.7798 10.5463 15.6996L13.4518 15.0854C13.5575 15.0618 13.6537 15.0071 13.728 14.9283L18.9042 9.44769Z"
                  fill="#FF7F7F"
                />
              </svg>
            </div>
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
              className={`flex justify-between items-center ${
                field === 'phoneNumber'
                  ? ''
                  : 'border-b-[0.3px] border-[#323232] pb-2'
              }`}>
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

        {isEditing && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleSave}
              className="bg-[#323232] text-white py-2 px-4 rounded-lg border border-gray-300">
              Save Changes
            </button>
          </div>
        )}

        <div className="mt-4 bg-[#F8F8F8] rounded-lg p-4 space-y-2">
          <div className="border-b-[0.3px] border-[#323232] pb-2 text-gray-800">
            Log Out
          </div>
          <div className="text-gray-800">Delete Account</div>
        </div>
      </div>

      <NavbarUser />
    </div>
  );
};

export default ProfilePage;

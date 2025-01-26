'use client';
import React, { useState, useRef } from 'react';
import axiosInstance from '../services/api/axiosInstance';

interface ImageUploaderProps {
  userId: number;
  currentImage: string | null;
  onImageUpdate: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  userId,
  currentImage,
  onImageUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSVGClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 

      try {
        const response = await axiosInstance.get(`/users/upload/${userId}`);
        const uploadURL = response.data.uploadURL;

        const uploadResponse = await fetch(uploadURL, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorDetails = await uploadResponse.text();
          console.error('Upload failed with response:', errorDetails);
          alert('Failed to upload image.');
          return;
        }

        const imageUrl = uploadURL.split('?')[0];

        const updateResponse = await axiosInstance.put(`/users/${userId}`, {
          profilePicture: imageUrl,
        });

        if (updateResponse.status === 200) {
          onImageUpdate(imageUrl);
          setImagePreview(null);
          alert('Image uploaded and profile updated successfully!');
        } else {
          alert('Failed to update profile picture.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="relative ml-auto text-center">
      <div>
        <img
          src={imagePreview || currentImage || '/img/dessert.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <div className="absolute top-0 right-0">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
            onClick={handleSVGClick}>
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
  );
};

export default ImageUploader;

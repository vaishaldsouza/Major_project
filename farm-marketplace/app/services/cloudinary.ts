import axios from 'axios';
import { Platform } from 'react-native';

// NOTE: These are fallback public Cloudinary credentials for testing.
// You should update these to your own Cloudinary Cloud Name and Unsigned Upload Preset in production.
const CLOUDINARY_CLOUD_NAME = 'dq7kxlmvy'; 
const UPLOAD_PRESET = 'farm_preset';       

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    
    if (Platform.OS === 'web') {
      // For web browser file uploads, resolve local blob URI to a Blob object
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('file', blob);
    } else {
      // For mobile app file uploads, pass the file details as FormData fields
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('file', {
        uri: imageUri,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data && response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error('Cloudinary response did not contain secure_url');
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    const errorMsg = error.response?.data?.error?.message || error.message || 'Image upload failed';
    throw new Error(errorMsg);
  }
};

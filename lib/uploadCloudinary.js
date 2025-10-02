// utils/uploadToCloudinary.js
import axios from "axios";

export async function uploadToCloudinary(file, folder = "NurzatProducts", resourceType="image", onProgress) {

    // const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudName = "dp5e3rgbl";
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "NuzratCarpet"); // Cloudinary unsigned preset
    formData.append("folder", folder);


    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress) {
        const progress = Math.round((event.loaded * 100) / event.total);
        onProgress(progress);
      }
    },
  });
  

     return res.data; // ✅ Cloudinary ka response { secure_url, public_id, ... }
}
  
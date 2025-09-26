// utils/uploadToCloudinary.js
import axios from "axios";

export async function uploadToCloudinary(file, folder = "NurzatProducts", onProgress) {

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "NuzratCarpet"); // Cloudinary unsigned preset
    formData.append("folder", folder);
  

    // const res = await fetch(
    //   `https://api.cloudinary.com/v1_1/dp5e3rgbl/upload`,
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );

    const url = `https://api.cloudinary.com/v1_1/dp5e3rgbl/upload`;

    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress) {
        const progress = Math.round((event.loaded * 100) / event.total);
        onProgress(progress);
      }
    },
  });
  
    // if (!res.ok) throw new Error("Cloudinary upload failed");
    // return await res.json(); // returns { secure_url, public_id, ... }

     return res.data; // ✅ Cloudinary ka response { secure_url, public_id, ... }
}
  
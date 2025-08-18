// utils/uploadToCloudinary.js
export async function uploadToCloudinary(file, folder = "NurzatProducts") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // Cloudinary unsigned preset
    formData.append("folder", folder);
  
    
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!res.ok) throw new Error("Cloudinary upload failed");
    return await res.json(); // returns { secure_url, public_id, ... }
  }
  
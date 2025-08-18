// utils/uploadToCloudinary.js
export async function uploadToCloudinary(file, folder = "NurzatProducts") {

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "NuzratCarpet"); // Cloudinary unsigned preset
    formData.append("folder", folder);
  

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dp5e3rgbl/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!res.ok) throw new Error("Cloudinary upload failed");
    return await res.json(); // returns { secure_url, public_id, ... }
}
  
const url = `https://api.cloudinary.com/v1_1/dwuuxtadq/image/upload/`;

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "rprvkmor");
    formData.append("cloud_name", "dwuuxtadq");

    console.log(formData);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default uploadImage;

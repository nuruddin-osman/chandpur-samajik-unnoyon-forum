"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiUser, FiCamera } from "react-icons/fi";

const ProfilePic = () => {
  const [saveId, setSeveId] = useState("");
  const [imageFile, setImageFile] = useState("");
  const fileInputRef = useRef(null);

  console.log(imageFile);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const postFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // backend field name "image"

      const res = await axios.post(
        "http://localhost:5000/api/members/upload-file",
        formData,
      );
      setSeveId(res.data.file._id);
      setImageFile(res.data.file.url);
      console.log("Upload success:", res.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  //   const getFile = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:5000/api/members/upload-file/${saveId}`,
  //       );
  //       console.log(res.data.file.url);
  //       setImageFile(res.data.file.url);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (saveId) {
  //       getFile();
  //     }
  //   }, [saveId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      postFile(file);
    }
  };

  return (
    <div className="w-20 h-20 relative">
      {/* Profile Box */}
      <div className="w-20 h-20 rounded-2xl bg-button-bg/10 flex items-center justify-center relative">
        {imageFile ? (
          <Image
            src={`/api/media/${imageFile.replace("/assets/", "")}`}
            alt="profile"
            fill
            sizes="80px"
            className="object-cover rounded-2xl"
          />
        ) : (
          <FiUser className="text-button-bg text-3xl" />
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleClick}
        className="absolute bottom-0 right-0 bg-button-bg text-white p-2 rounded-full shadow-md hover:scale-105 transition"
      >
        <FiCamera className="text-sm" />
      </button>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePic;

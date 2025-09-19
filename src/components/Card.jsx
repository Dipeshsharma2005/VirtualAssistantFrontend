import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
        const {serverUrl,userData, setUserData,backendImage, setBackEndImage,frontendImage, setFrontEndImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div onClick={()=>{setSelectedImage(image);setBackEndImage(null);setFrontEndImage(null)}} className={`lg:w-[150px] lg:h-[250px] h-[140px] w-[70px] bg-[#020220] cursor-pointer hover:shadow-2xl hover:border-4 hover:border-white hover:shadow-blue-950 border-2 border-[#0000ff66] rounded-2xl overflow-hidden ${selectedImage===image?"shadow-2xl border-4 border-white shadow-blue-950":null}`} >
      <img src={image} className="h-full object-cover" alt="assistant avatar"/>
    </div>
  );
}

export default Card;

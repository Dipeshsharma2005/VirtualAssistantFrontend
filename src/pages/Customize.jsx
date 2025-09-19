import React, { useContext } from "react";
import Card from "../components/Card";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize = () => {

    const navigate = useNavigate()
    
    const {serverUrl,userData, setUserData,backendImage, setBackEndImage,frontendImage, setFrontEndImage,selectedImage,setSelectedImage}=useContext(userDataContext)

    const inputImage = React.useRef();

    const handleImage=(e)=>{
        const file = e.target.files[0];
        setBackEndImage(file)
        setFrontEndImage(URL.createObjectURL(file))
    }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]">
        <h1 className="text-white mb-[30px] text-[30px] text-center">Select Your <span className="text-blue-200">Assistant Image</span></h1>
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] lg:gap-[20px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div onClick={()=>{inputImage.current.click();setSelectedImage("input")}} className={`lg:w-[150px] lg:h-[250px] h-[140px] w-[70px] bg-[#020220] cursor-pointer flex items-center justify-center hover:shadow-2xl hover:border-4 hover:border-white hover:shadow-blue-950 border-2 border-[#0000ff66] rounded-2xl overflow-hidden ${selectedImage==="input"?"shadow-2xl border-4 border-white shadow-blue-950":null}`}>
           {!frontendImage && <RiImageAddLine className="text-white h-[25px] w-[25px]"/>}
           {frontendImage && <img src={frontendImage} className="h-full object-cover"/>}
        </div>
        <input type="file" accept="image/*" hidden ref={inputImage} onChange={handleImage} />
      </div>

      {selectedImage &&<button className="min-w-[150px] h-[60px] mt-[30px]  font-semibold rounded-full text-[19px] bg-white text-black cursor-pointer" onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  );
};

export default Customize;

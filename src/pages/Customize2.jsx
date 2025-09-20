import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdKeyboard, MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
  

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true)
      let formData = new FormData();
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      formData.append("assistantName", assistantName);
      const userId = userData?.id || userData?.user?.id;

      const result = await axios.put(
        `${serverUrl}/api/users/update/${userId}`,
        formData,
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      <MdKeyboardBackspace onClick={()=>navigate("/customize")} className="absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]"/>
      <h1 className="text-white mb-[30px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        required
        value={assistantName}
        type="text"
        placeholder="eg. Shifra"
        className={`w-full h-[60px] max-w-[600px] outline-none border-2 bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]`}
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
                  disabled={loading}

          className={`min-w-[300px] h-[60px] mt-[30px]  font-semibold rounded-full text-[19px] cursor-pointer ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-white text-black"}`}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
         {loading?"Creating...": "Finally Create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;

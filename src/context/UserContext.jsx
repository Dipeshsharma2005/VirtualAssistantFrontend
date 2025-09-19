import axios from "axios";
import React, { createContext } from "react";

export const userDataContext = createContext();

function UserContext({ children }) {
    const [userData, setUserData] = React.useState(null)
        const [frontendImage, setFrontEndImage] = React.useState(null);
        const [backendImage, setBackEndImage] = React.useState(null);
        const [selectedImage,setSelectedImage] =React.useState(null)
    const serverUrl = "http://localhost:8080";
    const handleCurrentUser = async () =>{
      try {
        const response = await axios.get(`${serverUrl}/api/users/current`,{withCredentials: true});
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error)
      }
    }

    const getGeminiResponse=async(command)=>{
      try {
        const response = await axios.post(`${serverUrl}/api/users/ask?userId=${userData.id}`,{command},{withCredentials:true})
        return response.data
      } catch (error) {
        console.log(error)
      }
    }
    React.useEffect(() => {
      handleCurrentUser();
    }, []);
    const value = {
        serverUrl,userData, setUserData,backendImage, setBackEndImage,getGeminiResponse,frontendImage, setFrontEndImage,selectedImage,setSelectedImage
    };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;

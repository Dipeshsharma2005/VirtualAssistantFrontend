import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiGif from "../assets/ai.gif";
import userGif from "../assets/user.gif";
import { BiMenuAltRight } from "react-icons/bi";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1, RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ham, setHam] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const mobileHistoryRef = useRef(null);
  const desktopHistoryRef = useRef(null);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;

  const scrollToLastHistory = () => {
    if (mobileHistoryRef.current) {
      mobileHistoryRef.current.scrollTop =
        mobileHistoryRef.current.scrollHeight;
    }
    if (desktopHistoryRef.current) {
      desktopHistoryRef.current.scrollTop =
        desktopHistoryRef.current.scrollHeight;
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.delete(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };
  const startRecognition = () => {
    const recognition = recognitionRef.current;
    if (!isSpeakingRef.current && recognition && !isRecognizingRef.current) {
      try {
        recognition.start();
        isRecognizingRef.current = true;
        console.log("Recognition started (manual start)");
      } catch (error) {
        if (!error.message.includes("start")) console.log(error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition paused during speech");
    }

    isSpeakingRef.current = true;
    setIsSpeaking(true); // ✅ set speaking state
    synth.cancel();
    synth.speak(utterance);

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setIsSpeaking(false); // ✅ reset when finished
      console.log("Speech ended");
      setTimeout(() => startRecognition(), 400);
    };
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
  };

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("rec started");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log(error);
          }
        }
      }
    }, 1000);

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          isRecognizingRef.current = true;
          console.log("Recognition started (safeRecognition)");
        } catch (error) {
          if (!error.message.includes("start")) {
            console.log("Recognition error:", error);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition onstart");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition onend");
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(
          () =>
            safeRecognition(() => {
              if (isMounted) {
                try {
                  recognition.start();
                } catch (error) {
                  if (error.name !== "InvalidStateError") {
                    console.log(error);
                  }
                }
              }
            }),
          1000
        );
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition error:", event.error);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(
          () =>
            safeRecognition(() => {
              if (isMounted) {
                try {
                  recognition.start();
                } catch (error) {
                  if (error.name !== "InvalidStateError") {
                    console.log(error);
                  }
                }
              }
            }),
          1000
        );
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (!transcript) return;

      console.log("Transcript:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        if (data?.response) {
          handleCommand(data);
          setUserText("");
          setAiText(data.response);
        }
      }
    };

    safeRecognition();

    const fallback = setInterval(() => {
      if (!isRecognizingRef.current && !isSpeakingRef.current) {
        safeRecognition();
      }
    }, 10000);

    // === Greeting ===
    const greetingText = `Hello ${userData.name}, what can I help you with today?`;
    const greetingUtterance = new SpeechSynthesisUtterance(greetingText);
    greetingUtterance.lang = "hi-IN"; // or 'en-US'
    greetingUtterance.onend = () => startRecognition(); // start recognition after greeting
    window.speechSynthesis.speak(greetingUtterance);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [userData]);

  useEffect(() => {
    scrollToLastHistory();
  }, [userData?.history]);

  useEffect(() => {
    if (historyOpen) scrollToLastHistory();
  }, [historyOpen]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px]">
      <CgMenuRight
        onClick={() => setHam(true)}
        className="text-white w-[28px] absolute top-[20px] right-[20px] h-[28px] lg:hidden"
      />
      <div
        className={`p-[20px] lg:hidden flex flex-col gap-[20px] items-start absolute top-0 h-full w-full bg-[#00000053] backdrop-blur-md transform transition-transform duration-400 ${
          ham ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross1
          onClick={() => setHam(false)}
          className="text-white w-[28px] absolute top-[20px] right-[20px] h-[28px] lg:hidden"
        />
        <button
          onClick={handleLogOut}
          className=" min-w-[150px]  h-[60px]  cursor-pointer font-semibold rounded-full text-[19px] bg-white text-black"
        >
          Log Out
        </button>
        <button
          onClick={() => navigate("/customize")}
          className=" min-w-[150px] h-[60px]  bg-white text-black  cursor-pointer font-semibold rounded-full text-[19px] px-[20px] py-[10px]"
        >
          Customize Your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div
          ref={mobileHistoryRef} // or historyRefLg for large screens
          className="w-full h-[500px] overflow-y-auto overflow-x-hidden flex flex-col gap-[12px] p-2"
        >
          {userData?.history && userData.history.length > 0 ? (
            userData.history.map((his, idx) => {
              const [userMsg, aiMsg] = his.split("| Assistant:");
              return (
                <React.Fragment key={idx}>
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[75%] break-words">
                      {userMsg.replace("User:", "").trim()}
                    </div>
                  </div>
                  {/* Assistant bubble */}
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-[75%] break-words">
                      {aiMsg?.trim()}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-gray-400 text-center">No history yet</p>
          )}
        </div>
      </div>
      <button
        onClick={handleLogOut}
        className="hidden lg:block min-w-[150px] absolute top-[20px] right-[20px] h-[60px] mt-[30px] cursor-pointer font-semibold rounded-full text-[19px] bg-white text-black"
      >
        Log Out
      </button>
      <button
        onClick={() => navigate("/customize")}
        className="hidden lg:block min-w-[150px] absolute h-[60px] top-[100px] right-[20px] bg-white text-black mt-[30px] cursor-pointer font-semibold rounded-full text-[19px] px-[20px] py-[10px]"
      >
        Customize Your Assistant
      </button>
      <button
        onClick={() => setHistoryOpen(true)}
        className="min-w-[150px] h-[60px] hidden lg:block absolute right-[20px] top-[210px] bg-white text-black cursor-pointer font-semibold rounded-full text-[19px] px-[20px] py-[10px]"
      >
        History
      </button>
      <div
        className={`p-[20px] flex flex-col gap-[20px] items-start absolute top-0 right-0 h-full w-full lg:w-[350px] bg-[#00000053] backdrop-blur-md transform transition-transform duration-400 ${
          historyOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross1
          onClick={() => setHistoryOpen(false)}
          className="text-white w-[28px] absolute top-[20px] right-[20px] h-[28px]"
        />
        <h1 className="text-white font-semibold text-[19px] mb-2">History</h1>
        <div
          ref={desktopHistoryRef}
          className="w-full h-[600px] overflow-y-auto flex flex-col gap-[12px] p-2"
        >
          {userData?.history && userData.history.length > 0 ? (
            userData.history.map((his, idx) => {
              const [userMsg, aiMsg] = his.split("| Assistant:");
              return (
                <React.Fragment key={idx}>
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[75%]">
                      {userMsg.replace("User:", "").trim()}
                    </div>
                  </div>
                  {/* Assistant bubble */}
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-[75%]">
                      {aiMsg?.trim()}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-gray-400 text-center">No history yet</p>
          )}
        </div>
      </div>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-xl shadow-blue-950">
        <img
          src={userData?.assistantImage}
          className="h-full object-cover"
          alt=""
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {/* AI / User GIF */}
      <img
        src={isSpeaking ? aiGif : userGif}
        className="w-[200px] transition-all duration-300"
        alt="assistant-animation"
      />

      {/* Transcript */}
      {userText || aiText ? (
        <p className="text-white text-center text-[18px] font-semibold mt-2 px-4 break-words">
          {isSpeaking ? aiText : userText}
        </p>
      ) : null}
    </div>
  );
};

export default Home;

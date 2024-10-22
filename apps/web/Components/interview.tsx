"use client";
import useVapi from "../lib/hooks/useVapi";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect, useState } from "react";
import { Button } from "../Components/ui/button";
import {
  MessageCircleMore,
  ArrowDownToLine,
  Captions,
  CaptionsOff,
  Video,
  VideoOff,
  Maximize,
  Shrink,
  Phone,
  PhoneMissed,
} from "lucide-react";

import Image from "next/image"; // Adjust the path according to where your image is stored

function Interview() {
  const buttonSize = "w-14 h-14"; // Define button size here

  const { messages, toggleCall, callStatus, id, activeTranscript } = useVapi();
  const [videolink, setVideolink] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true); // Set to true to make buttons visible initially
  const [isCallActive, setIsCallActive] = useState(false);
  const [, setHovered] = useState(false);

  const renderMessage = (message: any, index: any) => {
    if (message.type === "FUNCTION_CALL") {
      return null;
    }

    const isUserMessage = message.role === "user";

    return (
      <div
        key={index}
        className={`flex mb-2 ${isUserMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`p-3 rounded-lg max-w-xs ${
            isUserMessage ? "bg-green-100 text-right" : "bg-blue-100 text-left"
          }`}
        >
          {message.transcript}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (callStatus === "inactive") {
      const fetchVideoLink = async () => {
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer 5c98fec7-7eee-4dc2-9a8d-1d0405835a50",
          },
        };
        const res = await fetch(`https://api.vapi.ai/call/${id}`, options);
        const data = await res.json();
        setVideolink(data.recordingUrl);
      };

      setTimeout(fetchVideoLink, 10000);
    }
  }, [callStatus]);

  const handleVideoToggle = async () => {
    const videoElement = document.querySelector("video");

    if (!videoElement) {
      console.error("Video element not found");
      return;
    }

    if (videoEnabled) {
      const stream = videoElement.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
      console.log("Stopping video stream...");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoElement.srcObject = stream;
        await videoElement.play();
        console.log("Starting video stream...");
      } catch (err) {
        console.error("Error starting video stream:", err);
      }
    }
    setVideoEnabled(!videoEnabled);
  };

  const handleCallToggle = () => {
    toggleCall();
    setIsCallActive(!isCallActive);

    if (!isCallActive) {
      handleVideoToggle();
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setControlsVisible(true);
  };

  const handleMouseMove = () => {
    setHovered(true);
    setControlsVisible(true);
    if (!isFullScreen) return;

    setTimeout(() => {
      setHovered(false);
      setControlsVisible(false);
    }, 5000);
  };

  const handlefullscreen = useFullScreenHandle();

  return (
    <FullScreen handle={handlefullscreen}>
      <div
        className={`flex flex-col h-screen ${isFullScreen ? "bg-black" : ""}`}
        onMouseMove={handleMouseMove}
      >
        {/* Main video and sidebar container */}
        <div
          className={`flex w-full transition-all duration-300 ${
            isFullScreen ? "h-screen" : "h-5/6"
          }`}
        >
          {/* Video Container */}
          <div
            className={`flex items-center justify-center bg-gray-200 transition-all duration-300 ${
              isSidebarOpen && !isFullScreen ? "w-2/3" : "w-full"
            } ${isFullScreen ? "bg-black" : ""}`}
          >
            {/* First Video Component */}
            <div className="p-4 w-full h-full relative">
              <video
                src={videolink}
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                className={`rounded-lg shadow-md ${
                  isFullScreen ? "h-full w-full" : ""
                }`}
              />
            </div>

            {/* Second Video Component */}
            <div className="relative w-1/2 h-full p-2">
              <div className="w-full h-full bg-[#607D8B] rounded-md flex items-center justify-center">
                <div
                  className="rounded-full overflow-hidden w-20 h-20 flex items-center justify-center bg-blue-300" // Added classes for size and background color
                >
                  <Image
                    src="/user1.jpg" // Update with the path to the image
                    alt="Suryansh Chourasia"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
                <p className="absolute bottom-2 text-white">
                  Suryansh Chourasia
                </p>
              </div>
            </div>
          </div>

          {/* Collapsible Sidebar for Messages */}
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } w-1/3 h-full overflow-y-auto bg-white shadow-lg transition-opacity duration-500 ease-in-out opacity-0 ${
              isSidebarOpen && "opacity-100"
            } ${isFullScreen ? "bg-black" : ""}`}
          >
            <h2 className="text-xl font-semibold mb-4 text-black text-center mt-4">
              CHAT
            </h2>

            <ul className="space-y-2">
              {messages.map((message, index) => renderMessage(message, index))}
            </ul>
            {showTranscript && (
              <div className="mt-4 p-4 bg-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Transcript</h3>
                <p>
                  {activeTranscript?.transcript || "No transcript available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div
          className={`flex justify-center items-center p-4 space-x-4 transition-opacity duration-300 ${
            isFullScreen
              ? "absolute bottom-0 w-full justify-end"
              : "justify-center"
          } ${isFullScreen ? (controlsVisible ? "opacity-100" : "opacity-0") : "opacity-100"}`} // Ensure opacity is 100 when not full screen
        >
          {/* Call Button */}
          <div className="relative group">
            <Button
              className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
              onClick={handleCallToggle}
            >
              {isCallActive ? <PhoneMissed /> : <Phone />}
            </Button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
              {isCallActive ? "End Call" : "Start Call"}
            </span>
          </div>

          {/* Video Toggle Button */}
          <div className="relative group">
            <Button
              className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
              onClick={handleVideoToggle}
            >
              {videoEnabled ? <VideoOff /> : <Video />}
            </Button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
              {videoEnabled ? "Turn Video Off" : "Turn Video On"}
            </span>
          </div>

          {/* Transcript Toggle Button */}
          <div className="relative group">
            <Button
              className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? <CaptionsOff /> : <Captions />}
            </Button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </span>
          </div>

          {/* Sidebar Toggle Button */}
          <div className="relative group">
            <Button
              className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MessageCircleMore />
            </Button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
              {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            </span>
          </div>

          {/* Fullscreen Toggle Button */}
          <div className="relative group">
            <Button
              className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
              onClick={() => {
                handlefullscreen.active
                  ? handlefullscreen.exit()
                  : handlefullscreen.enter();
                toggleFullScreen();
              }}
            >
              {isFullScreen ? <Shrink /> : <Maximize />}
            </Button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
              {isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            </span>
          </div>

          {/* Download Video Button */}
          {videolink && (
            <div className="relative group">
              <Button
                className={`bg-gray-800 text-white rounded-full ${buttonSize}`}
                onClick={() => window.open(videolink, "_blank")}
              >
                <ArrowDownToLine />
              </Button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                Download Video
              </span>
            </div>
          )}
        </div>
      </div>
    </FullScreen>
  );
}

export default Interview;

import { useState, useEffect, useRef, useContext } from "react";
import "tailwindcss/tailwind.css";
import { MyContext } from "../Context";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

const WebRTCComponent = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [localPeerConnection, setLocalPeerConnection] =
  //   useState<RTCPeerConnection | null>(null);
  const [localPeerConnections, setLocalPeerConnections] = useState<{
    [id: string]: RTCPeerConnection;
  }>({});
  console.log(
    "🚀 ~ WebRTCComponent ~ localPeerConnections:",
    localPeerConnections
  );
  const [pendingOffer, setPendingOffer] = useState<{
    [id: string]: {
      offer: RTCSessionDescriptionInit;
      socketId: string;
    } | null;
  }>({});
  console.log("🚀 ~ WebRTCComponent ~ pendingOffer:", pendingOffer);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState<{
    [id: string]: RTCIceCandidateInit[];
  }>({});
  console.log("🚀 ~ WebRTCComponent ~ iceCandidatesQueue:", iceCandidatesQueue);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // const localVideoRef = useRef<HTMLVideoElement>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVidRefs = useRef<{ [id: string]: HTMLVideoElement }>({});
  console.log("🚀 ~ WebRTCComponent ~ remoteVidRefs:", remoteVidRefs);
  const {
    socket,
    gameState: { playerStates },
    name,
  } = useContext(MyContext);
  const otherSocketIds = playerStates
    .filter((p) => p.name !== name)
    .map((e) => e.id);

  const signal = (eventName: string, data: any) => {
    socket?.emit(eventName, data);
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      // if (videoEnabled) {
      videoTracks.forEach((track) => (track.enabled = !track.enabled)); // Stop the video tracks
      // } else {
      //   try {
      //     const newStream = await navigator.mediaDevices.getUserMedia({
      //       video: true,
      //       audio: audioEnabled,
      //     });
      //     console.log("🚀 ~ toggleVideo ~ newStream:", localPeerConnection);
      //     const videoTrack = newStream.getVideoTracks()[0];
      //     localStream.addTrack(newStream.getVideoTracks()[0]);
      //     // setLocalStream(newStream);
      //     // localStream
      //     //   .getTracks()
      //     //   .forEach((track) =>
      //     //     localPeerConnection?.addTrack(track, localStream)
      //     //   );
      //     localPeerConnection
      //       ?.getSenders()
      //       .find((sender) => sender.track?.kind === "video")
      //       ?.replaceTrack(videoTrack);
      //   } catch (error) {
      //     console.error("Error enabling video:", error);
      //   }
      // }
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !audioEnabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  useEffect(() => {
    if (!Object.keys(remoteVidRefs.current).length) return;

    // remotePeerConnectionArg.ontrack = (event: RTCTrackEvent) => {
    //   console.log("🚀 ~ useEffect ~ event:", event.streams);
    //   remoteVideoRef.current!.srcObject = event.streams[0];
    // };

    const handleOffer = async (
      offer: RTCSessionDescriptionInit,
      socketId: string
    ) => {
      console.log(
        "🚀 ~ handleOffer ~ localPeerConnections[socketId]:",
        localPeerConnections[socketId]
      );
      if (!localPeerConnections[socketId])
        setPendingOffer((e) => ({ ...e, [socketId]: { socketId, offer } }));
      else {
        await localPeerConnections[socketId].setRemoteDescription(offer);
        const answer = await localPeerConnections[socketId].createAnswer();
        await localPeerConnections[socketId].setLocalDescription(answer);
        signal("answer", { answer, socketId });
      }
    };

    const handleIceCandidate = async (
      candidate: RTCIceCandidateInit,
      socketId: string
    ) => {
      if (localPeerConnections[socketId]) {
        await localPeerConnections[socketId].addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } else {
        setIceCandidatesQueue((ie) => ({
          ...ie,
          [socketId]: [...ie[socketId], new RTCIceCandidate(candidate)],
        }));
      }
    };

    const handleAnswer = async (
      answer: RTCSessionDescriptionInit,
      socketId: string
    ) => {
      const peer = localPeerConnections[socketId];
      if (peer) {
        await peer.setRemoteDescription(answer);
      }
    };

    socket?.on(
      "offer",
      (data: { offer: RTCSessionDescriptionInit; socketId: string }) => {
        handleOffer(data.offer, data.socketId);
      }
    );

    socket?.on(
      "candidate",
      (data: { candidate: RTCIceCandidateInit; socketId: string }) => {
        handleIceCandidate(data.candidate, data.socketId);
      }
    );

    socket?.on(
      "answer",
      (data: { answer: RTCSessionDescriptionInit; socketId: string }) => {
        handleAnswer(data.answer, data.socketId);
      }
    );

    return () => {
      socket?.off("offer");
      socket?.off("candidate");
      socket?.off("answer");
    };
  }, [localPeerConnections, remoteVidRefs.current, socket]);

  const startCall = async () => {
    if (Object.keys(localPeerConnections).length || !otherSocketIds.length)
      return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // if(audioEnabled) {
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = audioEnabled));
      // }
      // if(videoEnabled) {
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = videoEnabled));
      // }
      setLocalStream(stream);
      // if (localVideoRef.current) {
      //   localVideoRef.current.srcObject = stream;
      // }
      otherSocketIds.forEach(async (sId) => {
        const peerConnection = new RTCPeerConnection();

        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
        peerConnection.ontrack = (event: RTCTrackEvent) => {
          console.log("🚀 ~ useEffect ~ event:", event.streams);
          remoteVidRefs.current[sId].srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            signal("candidate", {
              candidate: event.candidate,
              socketId: sId,
            });
          }
        };
        console.log(
          "🚀 ~ otherSocketIds.forEach ~ pendingOffer[sId]:",
          pendingOffer[sId],
          sId
        );
        if (pendingOffer[sId]) {
          await peerConnection.setRemoteDescription(pendingOffer[sId].offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          signal("answer", { answer, socketId: pendingOffer.socketId });
          setPendingOffer((e) => ({ ...e, [sId]: null }));
        }
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (iceCandidatesQueue[sId]?.length) {
          iceCandidatesQueue[sId].forEach(async (candidate) => {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          });
          setIceCandidatesQueue((e) => ({ ...e, [sId]: [] }));
        }
        signal("offer", { offer, socketId: sId });
        setLocalPeerConnections((pcs) => ({ ...pcs, [sId]: peerConnection }));
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const hangupCall = () => {
    // localPeerConnection?.close();
    // setLocalPeerConnection(null);
    setLocalStream(null);
  };

  return (
    <div className="p-4 z-[52]">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">Local Video</h2>
          <video
            ref={(e) => {
              if (e) e.srcObject = localStream;
            }}
            autoPlay
            muted
            className="w-full h-full border border-gray-300 rounded-lg"
          />
        </div>
        <div className="border rounded-lg p-2">
          <h2 className="text-lg font-semibold mb-2">Remote Video</h2>
          {otherSocketIds.map((id) => (
            <video
              ref={(el) => {
                if (el) remoteVidRefs.current[id] = el;
              }}
              autoPlay
              className="w-full h-full border border-gray-300 rounded-lg"
            />
          ))}
        </div>
      </div>
      <div className="flex space-x-4">
        {!localPeerConnections.length ? (
          <button
            onClick={startCall}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={hangupCall}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hang Up
          </button>
        )}
        <button
          onClick={toggleVideo}
          className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ${
            videoEnabled ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          {!videoEnabled ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button
          onClick={toggleAudio}
          className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ${
            audioEnabled ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          {!audioEnabled ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
      </div>
    </div>
  );
};

export default WebRTCComponent;

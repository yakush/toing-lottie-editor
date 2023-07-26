import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { AnimationItem, BMDestroyEvent, BMEnterFrameEvent } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import { Lottie } from "../../core";
import useLottieStore from "../LottieStore";

type Props = {};

export default function LottiePlayer({}: Props) {
  const [playerRef, setPlayerRef] = useState<AnimationItem>();
  const [json, setJson] = useState<Lottie | null>();
  const lottie = useLottieStore((state) => state.lottie);

  const refCurrentTime = useRef(0);
  const refIsPaused = useRef(false);

  useEffect(() => {
    setJson(structuredClone(lottie));
  }, [lottie]);

  useEffect(() => {
    if (playerRef == null) {
      return;
    }
    const ref = playerRef;

    const handleEnterFrame = (e: BMEnterFrameEvent) => {
      refCurrentTime.current = e.currentTime / e.totalTime;
    };

    const handleDestroy = (e: BMDestroyEvent) => {
      // console.log("destroyed!!!!!!");
    };

    ref.addEventListener("enterFrame", handleEnterFrame);
    ref.addEventListener("destroy", handleDestroy);
    const isPausedTimer = setInterval(() => {
      refIsPaused.current = ref.isPaused;
    }, 100);

    return () => {
      try {
        ref.removeEventListener("enterFrame", handleEnterFrame);
      } catch (e) {}
      try {
        ref.addEventListener("destroy", handleDestroy);
      } catch (e) {}
      clearInterval(isPausedTimer);
    };
  }, [playerRef]);

  useEffect(() => {
    if (playerRef == null) {
      return;
    }
    if (lottie == null) {
      return;
    }

    if (refIsPaused.current) {
      playerRef.goToAndStop(
        refCurrentTime.current * playerRef.totalFrames,
        true
      );
    } else {
      playerRef.goToAndPlay(
        refCurrentTime.current * playerRef.totalFrames,
        true
      );
    }
  }, [playerRef, lottie]);

  return (
    <div>
      <Player
        lottieRef={(instance) => {
          setPlayerRef(instance);
        }}
        autoplay
        loop
        src={json || ""}
        // style={{ height: "300px", width: "300px" }}
      >
        <Controls
          visible={true}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    </div>
  );
}

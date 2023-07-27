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
  const displayName = useLottieStore(s=>s.displayName);

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

    // register listeners
    let listenerRemovers: (() => void)[] = [];
    listenerRemovers.push(
      ref.addEventListener("enterFrame", (e) => {
        refCurrentTime.current = e.currentTime / e.totalTime;
      })
    );
    listenerRemovers.push(
      ref.addEventListener("destroy", (e) => {
        // console.log("destroyed!!!!!!");
        listenerRemovers.forEach((remover) => {
          try {
            remover();
            // console.log("removed listener");
          } catch (e) {
            console.warn(e);
          }
        });
        listenerRemovers = [];
      })
    );

    const isPausedTimer = setInterval(() => {
      refIsPaused.current = ref.isPaused;
    }, 100);

    return () => {
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
      a:{displayName}
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

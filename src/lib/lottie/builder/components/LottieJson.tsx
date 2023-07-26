import { useLottieStore } from "../../app";
import LottieTree from "./LottieLayersTree";

type Props = {};

export default function LottieJson({}: Props) {
  const lottie = useLottieStore((state) => state.lottie);

  if (!lottie) {
    return <>no lottie json</>;
  }

  return (
    <div>
      <LottieTree layers={lottie.layers}>Lottie File</LottieTree>
    </div>
  );
}

import useToingStore from "../../stores/ToingStore";
import LottieTree from "./LottieLayersTree";

type Props = {};

export default function LottieJson({}: Props) {
  const lottie = useToingStore((state) => state.lottie);

  if (!lottie) {
    return <>no lottie json</>;
  }

  return (
    <div>
      <LottieTree layers={lottie.layers}>Lottie File</LottieTree>
    </div>
  );
}

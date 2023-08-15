export type LottieSimpleColor = {
  a?: 0;
  ix: number;
  k: number[];
};

export type LottieAnimColor = {
  a: 1;
  ix: number;
  k: {
    i: { x: number; y: number };
    o: { x: number; y: number };
    s: number[];
    t: number;
  }[];
};

export type LottieColor = LottieSimpleColor | LottieAnimColor;



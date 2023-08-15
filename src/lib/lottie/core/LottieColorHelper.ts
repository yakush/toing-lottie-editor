import { LottieColor } from "../types";

const ERROR_COLOR = "#ff00aaff"; //pink

//-------------------------------------------------------
export const LottieColorHelper = {
  isSimpleColor(c: LottieColor) {
    return c.a === 0 || c.a === undefined;
  },

  /**
   *
   * @param color array of colors (0..1)
   * @returns hex string, i.e. "#112233ff"
   */
  rgbToHex(color?: number[]) {
    if (!color) {
      console.warn(`rgbToHex() accepted null | undefined`);
      return ERROR_COLOR;
    }

    if (color.length < 3 || color.length > 4) {
      console.warn(`rgbToHex() accepted array of ${color.length} elements...`);
      return ERROR_COLOR;
    }

    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3] ?? 1;

    const r_str = colorComponentToHexPart(r);
    const g_str = colorComponentToHexPart(g);
    const b_str = colorComponentToHexPart(b);
    const a_str = colorComponentToHexPart(a);

    return `#${r_str}${g_str}${b_str}${a_str}`;
  },

  /**
   *
   * @param hex color string. i.e. "#112233ff" | "#123f" | "#112233" | "#123"
   * @returns color array (0..1)
   */
  hexToRgb(hex?: string) {
    let parts: RegExpExecArray | null = null;
    let result = [0, 0, 0, 1];

    if (!hex) {
      return result;
    }

    // #aa11bbff
    parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    // #a1bf
    parts = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    // #aa11bb
    parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    // #a1b
    parts = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    if (parts) {
      result = parts.slice(1).map((i) => parseInt(i, 16) / 255);
    }

    result.length = Math.min(4, result.length);
    if (result.length < 4) {
      result[0] = result[0] ?? 0;
      result[1] = result[1] ?? 0;
      result[2] = result[2] ?? 0;
      result[3] = result[3] ?? 1;
    }

    return result;
  },

  compareColorsArray(a: number[], b: number[]) {
    return this.compareColorsHex(this.rgbToHex(a), this.rgbToHex(b));
  },

  compareColorsHex(a: string | undefined, b: string | undefined) {
    if (a == null || b == null) {
      return false;
    }
    a = this.normalizeHexString(a);
    b = this.normalizeHexString(b);
    return a === b;
  },

  normalizeHexString(hex?: string) {
    return this.rgbToHex(this.hexToRgb(hex));
  },
};

//-------------------------------------------------------
// -- helpers funcs (not exported)
//-------------------------------------------------------
function bounds(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function colorComponentToHexPart(x: number) {
  x = Math.round(bounds(x * 255, 0, 255));
  let num = (1 << 8) + x;
  return num.toString(16).slice(1);
}

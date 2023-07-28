import { Lottie, LottieEdits } from "./types";

export interface LottieLoadResults {
  lottie: Lottie;
  edits?: LottieEdits;
}

export class LottieLoader {
  async loadUrl(url: string, urlEdits?: string): Promise<LottieLoadResults> {
    // fake wait for 1 second
    // await new Promise((res) => setTimeout(res, 1000));

    try {
      const res = await fetch(url);
      const lottie = await res.json();

      let edits = undefined;
      if (urlEdits) {
        const res = await fetch(urlEdits);
        const json = await res.json();
        edits = json;
      }

      return { lottie, edits };
    } catch (e) {
      throw e;
    }
  }

  async loadFile(file: File, editsFile?: File): Promise<LottieLoadResults> {
    const lottie = await readFileHelper(file);

    let edits = undefined;
    if (editsFile) {
      edits = await readFileHelper(editsFile);
    }

    return { lottie, edits };
  }
}

//-------------------------------------------------------
//-------------------------------------------------------

function readFileHelper(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => {
      console.log("file reading was aborted");
      reject("file reading was aborted");
    };

    reader.onerror = () => {
      console.log("file reading has failed");
      reject("file reading has failed");
    };

    reader.onload = () => {
      try {
        const str = reader.result as string;
        const content = JSON.parse(str);

        resolve(content);
      } catch (err) {
        console.log("JSON parsing failed");
        reject("JSON parsing failedF");
      }
    };
    reader.readAsText(file);
  });
}

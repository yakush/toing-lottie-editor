export class Loader<T> {
  async loadUrl(url: string): Promise<T> {
    // fake wait for 1 second
    // await new Promise((res) => setTimeout(res, 1000));

    try {
      const res = await fetch(url);
      const json = await res.json();

      return json as T;
    } catch (e) {
      throw e;
    }
  }

  async loadFile(file: File): Promise<T> {
    const json = await readFileHelper(file);

    return json as T;
  }
}

//-------------------------------------------------------
//-------------------------------------------------------

function readFileHelper<T>(file: File) {
  return new Promise<T>((resolve, reject) => {
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
        const content = JSON.parse(str) as T;

        resolve(content);
      } catch (err) {
        console.log("JSON parsing failed");
        reject("JSON parsing failedF");
      }
    };
    reader.readAsText(file);
  });
}

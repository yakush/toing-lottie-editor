export function createPublicUrl(file: string) {
  return `${process.env.PUBLIC_URL}/${file}`;
}

export function createPublicLottieSampleUrl(file: string) {
  return createPublicUrl(`lottie-samples/${file}`);
}

export async function saveFile(blob: Blob, filename: string) {
  const msSaveOrOpenBlob = (window.navigator as any)["msSaveOrOpenBlob"];
  if (msSaveOrOpenBlob)
    // IE10+
    msSaveOrOpenBlob(blob, filename);
  else {
    // Others
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

//upload to server:
export async function uploadToServer(
  blob: Blob,
  filename: string,
  url: string
) {
  const formData = new FormData();
  formData.append("content", blob, filename);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

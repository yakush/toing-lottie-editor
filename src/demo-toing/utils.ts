export function createPublicUrl(file: string) {
  return `${process.env.PUBLIC_URL}/${file}`;
}

export function createPublicLottieSampleUrl(file: string) {
  return createPublicUrl(`lottie-samples/${file}`);
}

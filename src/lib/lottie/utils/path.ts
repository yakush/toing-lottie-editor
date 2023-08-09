/**
 * src can be an object or a url to fetch it. get the object either way.
 * @param src url or object
 * @returns the object
 */
export async function resolveSrcToObject<T>(
  src: string | object | undefined | null
): Promise<T> {
  if (src == null) {
    return src as T;
  }

  // already an object?
  if (typeof src === "object") {
    return src as T;
  }

  // parse string to json object?
  try {
    return JSON.parse(src) as T;
  } catch (error) {
    // Do nothing...
  }

  // get from url?
  try {
    return (await (await fetch(src)).json()) as T;
  } catch (error) {
    // Do nothing...
  }

  throw new Error("unable to resolve src");
}

// function isValidURL(url: string) {
//   const match = url.match(
//     /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#= ]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
//   );
//   return match !== null;
// }

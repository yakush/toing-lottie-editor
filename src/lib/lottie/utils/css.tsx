export function combineClasses(
  ...classes: (string | undefined | null | { [key: string]: boolean })[]
) {
  classes = classes.filter((clazz) => !!clazz);

  classes = classes.reduce<string[]>((acc, clazz) => {
    if (typeof clazz === "string") {
      acc = [...acc, clazz];
    } else if (typeof clazz === "object") {
      for (const key in clazz) {
        if (Object.prototype.hasOwnProperty.call(clazz, key)) {
          const useClazz = clazz[key];
          if (useClazz) {
            acc = [...acc, key];
          }
        }
      }
    }
    return acc;
  }, []);

  return classes.join(" ");
}

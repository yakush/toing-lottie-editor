export function combineClasses(
  styles: any,
  classes: (string | boolean | undefined | null)[]
) {
  classes = classes.filter((clazz) => !!clazz);
  return classes.map((className) => styles[className as string]).join(" ");
}

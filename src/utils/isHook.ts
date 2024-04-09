export function isHook(name: string) {
  if (!name.startsWith("use")) {
    return false;
  }

  const fourthChar = name.charAt(3);

  // if the fourth character is uppercase, it's a hook, otherwise it's a function
  return fourthChar === fourthChar.toUpperCase();
}

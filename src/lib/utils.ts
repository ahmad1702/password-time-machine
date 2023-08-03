import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const classifyString = (input: string): number => {
  const hasNumbers = /\d/.test(input);
  const hasLowercase = /[a-z]/.test(input);
  const hasUppercase = /[A-Z]/.test(input);
  const hasSymbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=|]/.test(input);

  if (hasNumbers && !hasLowercase && !hasUppercase && !hasSymbols) {
    return 0;
  } else if (!hasNumbers && hasLowercase && !hasUppercase && !hasSymbols) {
    return 1;
  } else if (!hasNumbers && (hasLowercase || hasUppercase) && !hasSymbols) {
    return 2;
  } else if (hasNumbers && (hasLowercase || hasUppercase) && !hasSymbols) {
    return 3;
  } else if (hasNumbers && (hasLowercase || hasUppercase) && hasSymbols) {
    return 4;
  } else {
    return -1; // Indicate an invalid or unsupported input
  }
};

export const intToString = (num: number, abbreviated = false) => {
  num = num.toString().replace(/[^0-9.]/g, "") as any;
  if (num < 1000) {
    return num.toString();
  }
  let si = [
    { v: 1e3, s: "K", f: " thousand" },
    { v: 1e6, s: "M", f: " million" },
    { v: 1e9, s: "B", f: " billion" },
    { v: 1e12, s: "T", f: " trillion" },
    { v: 1e15, s: "P", f: "pentillion" },
    { v: 1e18, s: "E", f: "extillion" },
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }
  return (
    (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
    si[index].s
  );
};

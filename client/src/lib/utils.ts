import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertTimeTo24Hour = (time12hr: string | undefined) => {
  if (!time12hr) return "";

  const parts = time12hr.split(" ");
  const timeParts = parts[0].split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  const amPm = parts[1];

  let hours24 = hours;
  if (amPm === "PM" && hours < 12) {
    hours24 = hours + 12;
  } else if (amPm === "AM" && hours === 12) {
    hours24 = 0;
  }

  return `${hours24.toString().padStart(2, "0")}:${minutes}`;
};

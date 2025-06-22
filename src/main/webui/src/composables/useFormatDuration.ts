import dayjs from "dayjs";

export default function (seconds: number | undefined) {
  return seconds
    ? dayjs
        .duration(seconds, "seconds")
        .format("D[d]-HH:mm:ss")
        .replace(/\b0+[a-z]+\s*/gi, "")
        .replace(/-00:/, "")
        .replace("-", " ")
        .trim()
    : "";
}

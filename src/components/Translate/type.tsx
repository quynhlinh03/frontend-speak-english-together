export interface TranslateProps {
  text: string;
  to: string;
  from?: string;
}
export interface TranslateResProps {
  status: string;
  meaning?: string;
  examples?: Emxamples[];
  context?: string;
}
export interface Emxamples {
  text: string;
  translation: string;
}
export const nationalData = [
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg",
    label: "Vietnamese",
    value: "vietnamese",
  },
  {
    image:
      "https://cdn.britannica.com/33/4833-004-828A9A84/Flag-United-States-of-America.jpg",
    label: "English",
    value: "english",
  },
];

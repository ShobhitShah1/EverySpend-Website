export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I need to connect SMS?",
    answer:
      "No. You can enter expenses manually. SMS import is optional on Android.",
  },
  {
    question: "Where is SMS import processed?",
    answer:
      "Optional SMS import is processed on your Android device.",
  },
  {
    question: "Can I use EverySpend on iPhone?",
    answer: "EverySpend is an Android app.",
  },
];

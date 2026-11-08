/**
 * ফলাফলের ডেটা — নতুন পরীক্ষার ফলাফল দিতে শুধু এই ফাইলটি পরিবর্তন করুন।
 *
 * - নাম্বারগুলো ইংরেজি সংখ্যায় (0-9) লিখুন; ওয়েবসাইটে স্বয়ংক্রিয়ভাবে বাংলায় দেখাবে।
 * - পরীক্ষায় অনুপস্থিত থাকলে সংশ্লিষ্ট ঘরে null লিখুন।
 * - "প্রাপ্ত স্থান" নিজে লিখতে হবে না; মোট নাম্বার অনুযায়ী স্বয়ংক্রিয়ভাবে নির্ণয় হবে।
 *   (মোট নাম্বার সমান হলে একই স্থান দেখাবে।)
 */
window.RESULT_DATA = {
  examTitle: "তাজউইদ মূল্যায়ন - ০১",

  students: [
    // name: নাম | chief: প্রধান উস্তাজার উপস্থিতি | assistant: সহকারী উস্তাজার উপস্থিতি
    // recitation: পড়া আদায় ক্লাস | oral: মৌখিক পরীক্ষা | behavior: আচরণ | total: মোট
    { name: "তানজিনা", chief: 3,  assistant: 7,  recitation: 6, oral: 45,   behavior: 3, total: 64 },
    { name: "লামিয়া",  chief: 11, assistant: 12, recitation: 8, oral: 43,   behavior: 3, total: 77 },
    { name: "হাফসা",   chief: 11, assistant: 10, recitation: 6, oral: 34,   behavior: 3, total: 64 },
    { name: "তানিয়া",  chief: 8,  assistant: 10, recitation: 6, oral: 40,   behavior: 3, total: 67 },
    { name: "লুনা",    chief: 10, assistant: 8,  recitation: 5, oral: 40,   behavior: 3, total: 66 },
    { name: "মুক্তা",   chief: 6,  assistant: 9,  recitation: 7, oral: 46,   behavior: 3, total: 71 },
    { name: "শিল্পি",   chief: 10, assistant: 9,  recitation: 5, oral: null, behavior: 2, total: 26 },
    { name: "শিমু",    chief: 5,  assistant: 4,  recitation: 2, oral: null, behavior: 2, total: 13 }
  ]
};

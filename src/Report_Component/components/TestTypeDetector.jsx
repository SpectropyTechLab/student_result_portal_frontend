const detectTestType = (exam = "") => {
  const s = String(exam).toLowerCase();
  if (/(week\s*test|weekly|\bwt\b)/i.test(s)) return "Weekly Tests";
  if (/(unit\s*test|\but\b)/i.test(s)) return "Unit Tests";
  if (/(grand\s*test|\bgt\b|mock\s*test)/i.test(s)) return "Grand Tests";
  return "Other Tests";
};

const GROUP_ORDER = ["Weekly Tests", "Unit Tests", "Grand Tests"];

export { detectTestType, GROUP_ORDER };

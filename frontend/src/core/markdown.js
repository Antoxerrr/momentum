import hljs from "highlight.js";

export const formatMarkdown = text => {
  text = text || '';
  return text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
};

export const highlightMarkdown = (code, lang) => {
  return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
};

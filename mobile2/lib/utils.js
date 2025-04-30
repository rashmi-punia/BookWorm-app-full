// "May 2025"
export function formatMemberSince(dateString) {
  const date = new Date(dateString);
//   console.log("date", date);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year};`;
}

// "MAy 12 2929"
export function formatPublishDate(dateString) {
  const date = new Date(dateString);
//   console.log("date", date);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day} ${year};`;
}

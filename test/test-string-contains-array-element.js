let str =
  "https://github.com/TheAssassin/AppImageLauncher/releases/download/v2.2.0/appimagelauncher-2.2.0-travis995.0f91801.i386.rpm";
let containsArr = ["chfdsaflkh", "rpm"];
// let containsArr = [];
let isContains = containsArr.some((keyword) => {
  return str.includes(keyword);
});
console.log(isContains);
console.log(str.includes("rpm"));

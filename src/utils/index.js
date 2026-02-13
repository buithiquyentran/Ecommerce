import _ from "lodash";

const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
// [a, b, c]  => { a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((sel) => [sel, 1]));
};
// [a, b, c]  => { a: 0, b: 0, c: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((sel) => [sel, 0]));
};
const removeUndefinedObject = (obj = {}) => { 
  Object.keys(obj).forEach(
    (key) => obj[key] === undefined || obj[key] === null && delete obj[key]
  );
  return obj;
}
const updateNestedObjectParser = (obj = {})=>{
  const result = {}
   Object.keys(obj).forEach(
    (key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])){
        const nestedObj = updateNestedObjectParser(obj[key]);
        Object.keys(nestedObj).forEach((nestedKey) => {
          result[`${key}.${nestedKey}`] = nestedObj[nestedKey];
        });
      } else {
        result[key] = obj[key];
      }
    }
  );
  console.log("updateNestedObjectParser result", result);
  return result;
}
export { getInforData, getSelectData, unGetSelectData, removeUndefinedObject, updateNestedObjectParser };

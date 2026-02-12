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

export { getInforData, getSelectData, unGetSelectData };

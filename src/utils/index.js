import _ from "lodash";

const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

export { getInforData };
export const transformStatus = (status: string) => {
  return status.split("_").join(" ").toUpperCase();
};

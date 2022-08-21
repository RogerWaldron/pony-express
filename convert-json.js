const jsonToCsv = (data) => {
  let csv = data.map((row) =>
    Object.values(row).map((item) => JSON.stringify(item))
  );
  csv.unshift(Object.keys(data[0])); // header row
  return csv.join("\n");
};

module.exports = jsonToCsv;

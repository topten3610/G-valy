const displayINRCurrency = (num) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    currencyDisplay: "code", // Ensures 'BDT' is not shown as a symbol
  });

  return `TK. ${formatter.format(num).replace("BDT", "").trim()}`;
};

export default displayINRCurrency;

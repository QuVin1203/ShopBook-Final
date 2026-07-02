export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueInParams = searchParams.has(key);

  if (value && hasValueInParams) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueInParams) {
    searchParams.delete(key);
  }

  return searchParams;
};

export const isHoChiMinhCity = (city = "") => {
  const normalizedCity = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    normalizedCity.includes("ho chi minh") ||
    normalizedCity.includes("hcm") ||
    normalizedCity.includes("tphcm") ||
    normalizedCity.includes("tp hcm") ||
    normalizedCity.includes("sai gon") ||
    normalizedCity.includes("saigon")
  );
};

export const caluclateOrderCost = (cartItems, shippingInfo = {}) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // Miễn phí ship nội thành HCM
  const shippingPrice = isHoChiMinhCity(shippingInfo?.city)
    ? 0
    : 30000;

  const totalPrice = itemsPrice + shippingPrice;

  return {
    itemsPrice: Number(itemsPrice),
    shippingPrice: Number(shippingPrice),
    totalPrice: Number(totalPrice),
  };
};
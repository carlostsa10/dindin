import api from "../api";
import { getItem } from "../../utils/storage";

export const getCategories = async () => {
  const token = getItem("token");
  const response = await api.get("/categorias", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

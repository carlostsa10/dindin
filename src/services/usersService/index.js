import { getItem } from "../../utils/storage";
import api from "../api";

export const userLogin = async (email, password) => {
  const response = await api.post("/login", {
    email,
    senha: password,
  });

  return response;
};

export const userCadastro = async ({ name, email, password }) => {
  const response = await api.post("/usuario", {
    nome: name,
    email,
    senha: password,
  });

  return response;
};

export const userEdit = async (name, email, password) => {
  const token = getItem("token");

  const response = await api.put(
    "/usuario",
    {
      nome: name,
      email,
      senha: password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getUser = async () => {
  const token = getItem("token");
  const response = await api.get("/usuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

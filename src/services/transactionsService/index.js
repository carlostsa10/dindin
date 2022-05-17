import { getItem } from "../../utils/storage";
import api from "../api";

export const getTransactions = async () => {
  const token = getItem("token");
  const response = await api.get(`/transacoes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getExtrato = async () => {
  const token = getItem("token");
  const response = await api.get(`/transacoes/extrato`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getTransaction = async (transactionId) => {
  const token = getItem("token");
  const response = await api.get(`/transacoes/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addTransactions = async (
  tipo,
  descricao,
  valor,
  data,
  categoria_id
) => {
  const token = getItem("token");
  const response = await api.post(
    `/transacoes`,
    {
      tipo,
      descricao,
      valor,
      data,
      categoria_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const editTransaction = async (
  transactionId,
  tipo,
  descricao,
  valor,
  data,
  categoria_id
) => {
  const token = getItem("token");
  const response = await api.put(
    `/transacoes/${transactionId}`,
    {
      tipo,
      descricao,
      valor,
      data,
      categoria_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteTransaction = async (transactionId) => {
  const token = getItem("token");
  const response = await api.delete(`/transacoes/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

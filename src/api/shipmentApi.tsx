import type { ShipmentDTO, ResponseDTO, ShipmentRequestDTO } from "../types/shipment";

const BASE_URL = "http://localhost:8080/api/shipment";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function fetchShipments(): Promise<ResponseDTO<ShipmentDTO[]>> {
  const res = await fetch(`${BASE_URL}/all`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function fetchShipmentById(id: string): Promise<ResponseDTO<ShipmentDTO>> {
  const res = await fetch(`${BASE_URL}/fetchShipmentDetails/${id}`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function fetchShipmentByOrderId(id: string): Promise<ResponseDTO<ShipmentDTO>> {
  const res = await fetch(`${BASE_URL}/fetchShipmentDetails/order/${id}`, {
    headers: getAuthHeader(),
  });
  return res.json();
}


export async function addShipment(data: ShipmentRequestDTO): Promise<ResponseDTO<ShipmentDTO>> {
  const res = await fetch(`${BASE_URL}/addShipmentDetails`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateShipmentStatus(id: string, status: string): Promise<ResponseDTO<ShipmentDTO>> {
  const res = await fetch(`${BASE_URL}/updateShippingStatus/${id}?shipmentStatus=${status}`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function cancelShipment(orderId: string): Promise<ResponseDTO<null>> {
  const res = await fetch(`${BASE_URL}/cancelShipment/${orderId}`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function deleteShipment(id: string): Promise<ResponseDTO<null>> {
  const res = await fetch(`${BASE_URL}/deleteShipping/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
}

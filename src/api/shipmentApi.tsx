import type { ShipmentDTO, ResponseDTO, ShipmentRequestDTO } from "../types/shipment";

const BASE_URL = "http://localhost:8080/api/shipment";

const getAuthHeader = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

async function handleApiResponse<T>(res: Response): Promise<ResponseDTO<T>> {
  try {
    const json = await res.json();
    if (!res.ok) {
      return {
        status: res.status,
        message: json.message || "Error occurred",
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
    return json;
  } catch {
    return {
      status: res.status,
      message: "Failed to parse server response",
      data: null,
      timestamp: new Date().toISOString(),
    };
  }
}

function handleError<T>(message: string = "Service unavailable"): ResponseDTO<T> {
  return {
    status: 500,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  };
}

export async function fetchShipments(): Promise<ResponseDTO<ShipmentDTO[]>> {
  try {
    const res = await fetch(`${BASE_URL}/fetchAllShipment`, {
      headers: getAuthHeader(),
    });
    return await handleApiResponse<ShipmentDTO[]>(res);
  } catch {
    return handleError<ShipmentDTO[]>();
  }
}

export async function fetchShipmentById(id: string): Promise<ResponseDTO<ShipmentDTO>> {
  try {
    const res = await fetch(`${BASE_URL}/fetchShipmentDetails/${id}`, {
      headers: getAuthHeader(),
    });
    return await handleApiResponse<ShipmentDTO>(res);
  } catch {
    return handleError<ShipmentDTO>();
  }
}

export async function fetchShipmentByOrderId(id: string): Promise<ResponseDTO<ShipmentDTO>> {
  try {
    const res = await fetch(`${BASE_URL}/fetchShipmentDetails/order/${id}`, {
      headers: getAuthHeader(),
    });
    return await handleApiResponse<ShipmentDTO>(res);
  } catch {
    return handleError<ShipmentDTO>();
  }
}

export async function addShipment(data: ShipmentRequestDTO): Promise<ResponseDTO<ShipmentDTO>> {
  try {
    const res = await fetch(`${BASE_URL}/addShipmentDetails`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse<ShipmentDTO>(res);
  } catch {
    return handleError<ShipmentDTO>();
  }
}

export async function updateShipmentStatus(id: string, status: string): Promise<ResponseDTO<ShipmentDTO>> {
  try {
    const res = await fetch(`${BASE_URL}/updateShippingStatus/${id}?shipmentStatus=${status}`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return await handleApiResponse<ShipmentDTO>(res);
  } catch {
    return handleError<ShipmentDTO>();
  }
}

export async function cancelShipment(orderId: string): Promise<ResponseDTO<null>> {
  try {
    const res = await fetch(`${BASE_URL}/cancelShipment/${orderId}`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return await handleApiResponse<null>(res);
  } catch {
    return handleError<null>();
  }
}

export async function deleteShipment(id: string): Promise<ResponseDTO<null>> {
  try {
    const res = await fetch(`${BASE_URL}/deleteShipping/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return await handleApiResponse<null>(res);
  } catch {
    return handleError<null>();
  }
}

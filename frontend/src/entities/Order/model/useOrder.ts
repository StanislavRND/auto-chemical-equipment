import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteOrder,
  useUpdateStatusOrder,
  type Order,
  type Status,
} from "../api/order";

export const useOrder = (order: Order) => {
  const navigate = useNavigate();
  const deleteOrderMutation = useDeleteOrder();
  const updateStatusMutation = useUpdateStatusOrder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<Status>(order.status);

  const statusTextMap: Record<Status, string> = {
    success: "Завершен",
    pending: "В ожидании",
    ready: "В сборке",
  };

  const statusOptions = [
    { label: "Завершен", value: "success" },
    { label: "В ожидании", value: "pending" },
    { label: "В сборке", value: "ready" },
  ];

  const handleOpenProducts = (id: number) => {
    navigate(`/profile/orders/${id}`);
  };

  const handleDelete = () => {
    deleteOrderMutation.mutate(order.id);
    setIsModalOpen(false);
  };

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    updateStatusMutation.mutate({ status: newStatus, orderId: order.id });
  };

  return {
    order,
    status,
    setStatus,
    isModalOpen,
    setIsModalOpen,
    statusTextMap,
    statusOptions,
    handleOpenProducts,
    handleDelete,
    handleStatusChange,
  };
};

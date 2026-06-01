"use client";

import Swal from "sweetalert2";

const baseConfig = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: true,
};

export const showSuccess = (message) =>
  Swal.fire({ ...baseConfig, icon: "success", title: message, timer: 2500 });

export const showError = (message) =>
  Swal.fire({ ...baseConfig, icon: "error", title: message, timer: 3000 });

export const showConfirm = async ({ title, text, confirmText = "Yes", confirmColor = "#2563EB" }) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#6b7280",
    borderRadius: "16px",
  });
  return result.isConfirmed;
};

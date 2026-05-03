"use client";

import AdminLoadingState from "@/components/admin/AdminLoadingState";

export default function AdminLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <AdminLoadingState type="dashboard" />
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";
import { ProductForm } from "../../components/admin/ProductForm";

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="py-2">
      <ProductForm productId={id} />
    </div>
  );
};

export default AdminProductFormPage;

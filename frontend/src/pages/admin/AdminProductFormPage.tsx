import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link to="/admin/products">
          <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">
              {isEditing ? `Edit Equipment ID #${id}` : "New Equipment Spec"}
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              {isEditing ? `/admin/products/${id}/edit` : "/admin/products/new"}
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            {isEditing ? "Edit Equipment Specification" : "Register New Equipment Model"}
          </h1>
        </div>
      </div>

      {/* Phase 1 Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Schema:</span>
          {" "}This form demonstrates route binding for both new creation and editing. Live database writes and Supabase file uploads will be connected in Phase 4.
        </div>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Product form submission will be wired to backend REST API in Phase 4.");
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Product Model Name"
                placeholder="e.g. Genesis Prime 500 kVA DG Set"
                defaultValue={isEditing ? "Genesis Prime 500 kVA DG Set" : ""}
                required
              />
              <Input
                label="URL Slug"
                placeholder="genesis-prime-500kva-dg-set"
                defaultValue={isEditing ? "genesis-prime-500kva-dg-set" : ""}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="Equipment Category"
                options={[
                  { value: "generators", label: "Diesel Generators" },
                  { value: "acoustic", label: "Acoustic Enclosures" },
                  { value: "turnkey", label: "Turnkey Power Plants" },
                  { value: "panels", label: "AMF / Synchronization Panels" },
                ]}
                required
              />
              <Input
                label="Rated Output Capacity (kVA)"
                placeholder="e.g. 500 kVA"
                defaultValue={isEditing ? "500 kVA" : ""}
                required
              />
            </div>

            <Textarea
              label="Engineering Description"
              rows={4}
              placeholder="Technical summary of performance, fuel consumption, alternator brand, and engine specs..."
              defaultValue={isEditing ? "Designed for continuous heavy manufacturing plants, hospitals, and critical data backup." : ""}
            />

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link to="/admin/products">
                <Button variant="ghost" size="md">Cancel</Button>
              </Link>
              <Button
                type="submit"
                variant="accent"
                size="md"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isEditing ? "Update Specifications" : "Save to Equipment Catalog"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductFormPage;

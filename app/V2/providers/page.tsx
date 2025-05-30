"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Provider = {
  _id: string;
  companyName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  notes?: string;
  licenseNumber?: string;
  bankTransferDetails?: string;
};

const emptyProvider = {
  companyName: "",
  address: "",
  phoneNumber: "",
  email: "",
  contactName: "",
  notes: "",
  licenseNumber: "",
  bankTransferDetails: "",
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Provider, "_id">>(emptyProvider);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await fetch("/api/providers");
    const data = await res.json();
    setProviders(data.providers);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId
      ? `/api/providers/${editingId}`
      : "/api/providers";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editingId ? "Provider updated" : "Provider added");
      setDialogOpen(false);
      setForm(emptyProvider);
      setEditingId(null);
      fetchProviders();
    } else {
      toast.error("Failed to save provider");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק ספק זה?")) return;

    const res = await fetch("/api/providers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("Provider deleted");
      fetchProviders();
    } else {
      toast.error("Failed to delete provider");
    }
  };

  const openEditDialog = (provider: Provider) => {
    setForm({ ...provider });
    setEditingId(provider._id);
    setDialogOpen(true);
  };

  const displayValue = (value?: string) => value || "";

  return (
    <div dir="rtl" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ספקים</h1>
        <Button
          onClick={() => {
            setForm(emptyProvider);
            setEditingId(null);
            setDialogOpen(true);
          }}
        >
          הוסף ספק
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" >
        {providers.map((provider) => (
          <Card key={provider._id} className="rounded-xl shadow-md">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {displayValue(provider.companyName)}
                </h2>
                <Badge variant="outline">
                  {displayValue(provider.licenseNumber) || "אין מספר חברה"}
                </Badge>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>איש קשר:</strong>{" "}
                  {displayValue(provider.contactName)}
                </p>
                <p>
                  <strong>טלפון:</strong> {displayValue(provider.phoneNumber)}
                </p>
                <p>
                  <strong>אימייל:</strong> {displayValue(provider.email)}
                </p>
                <p>
                  <strong>כתובת:</strong> {displayValue(provider.address)}
                </p>
                <p>
                  <strong>פרטי העברה בנקאית:</strong>{" "}
                  {displayValue(provider.bankTransferDetails)}
                </p>
                <p>
                  <strong>הערות:</strong> {displayValue(provider.notes)}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => openEditDialog(provider)}
                >
                  ערוך
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(provider._id)}
                >
                  מחק
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "ערוך ספק" : "הוסף ספק"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              placeholder="שם החברה"
              required
            />
            <Input
              name="contactName"
              value={form.contactName}
              onChange={handleInputChange}
              placeholder="שם איש קשר"
            />
            <Input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
              placeholder="מספר טלפון"
            />
            <Input
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="אימייל"
            />
            <Input
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="כתובת"
            />
            <Input
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleInputChange}
              placeholder="מספר רישוי"
            />
            <Input
              name="bankTransferDetails"
              value={form.bankTransferDetails}
              onChange={handleInputChange}
              placeholder="פרטי העברה בנקאית"
            />
            <Textarea
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              placeholder="הערות"
            />
            <Button onClick={handleSave}>
              {editingId ? "עדכן" : "הוסף"} ספק
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

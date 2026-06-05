"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  ShoppingBag,
  ListOrdered,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Mail,
  Upload,
  CheckCircle,
  AlertCircle,
  Search,
  DollarSign,
  Package,
  Clock,
  QrCode,
} from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Prevent hydration mismatch — only render on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "settings">("orders");

  // State arrays
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    upiQrCode: "",
    upiId: "",
    contactEmail: "",
    contactPhone: "",
    heroBannerUrl: "",
    heroBannerType: "image",
  });

  // Action status indicators
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search filter
  const [orderSearch, setOrderSearch] = useState("");

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null); // null means "Add Product"
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    shippingCharge: "",
    images: [] as string[],
    videos: [] as string[],
    variants: "",
    isActive: true,
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");

  // Security Settings State
  const [credCurrentPassword, setCredCurrentPassword] = useState("");
  const [credNewEmail, setCredNewEmail] = useState("");
  const [credNewPassword, setCredNewPassword] = useState("");
  const [credLoading, setCredLoading] = useState(false);
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");

  // Cloudinary settings from next public env vars
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sujood_mate_preset";

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Fetch data
  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
      fetchProducts();
      fetchSettings();
    }
  }, [status]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const triggerFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // 1. ORDERS HANDLERS
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        triggerFeedback("success", `Order status updated to: ${newStatus}`);
        fetchOrders();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to update order status");
      }
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendConfirmationEmail = async (orderId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/email/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.logged) {
          triggerFeedback("success", "Email simulated to console (SMTP not configured).");
        } else {
          triggerFeedback("success", "Manual confirmation email sent to customer!");
        }
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. PRODUCT HANDLERS
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      shippingCharge: "",
      images: [],
      videos: [],
      variants: "",
      isActive: true,
    });
    setImageUrlInput("");
    setVideoUrlInput("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: String(prod.price),
      salePrice: prod.salePrice ? String(prod.salePrice) : "",
      shippingCharge: prod.shippingCharge !== undefined ? String(prod.shippingCharge) : "0",
      images: prod.images || [],
      videos: prod.videos || (prod.video ? [prod.video] : []),
      variants: prod.variants ? prod.variants.join(", ") : "",
      isActive: prod.isActive,
    });
    setImageUrlInput("");
    setVideoUrlInput("");
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      salePrice: productForm.salePrice !== "" ? Number(productForm.salePrice) : 0,
      shippingCharge: productForm.shippingCharge !== "" ? Number(productForm.shippingCharge) : 0,
      variants: productForm.variants
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id || editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        triggerFeedback(
          "success",
          `Product ${editingProduct ? "updated" : "created"} successfully!`
        );
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (productForm.images.includes(url)) {
      triggerFeedback("error", "This image URL is already added.");
      return;
    }
    setProductForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput("");
  };

  // Add video by URL
  const handleAddVideoUrl = () => {
    const url = videoUrlInput.trim();
    if (!url) return;
    if (productForm.videos.includes(url)) {
      triggerFeedback("error", "This video URL is already added.");
      return;
    }
    setProductForm((prev) => ({ ...prev, videos: [...prev.videos, url] }));
    setVideoUrlInput("");
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        triggerFeedback("success", "Product deleted successfully!");
        fetchProducts();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. SETTINGS HANDLERS
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(session?.user as any)?.token) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        triggerFeedback("success", "System settings updated successfully!");
        fetchSettings();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(session?.user as any)?.token) return;
    setCredLoading(true);
    setCredError("");
    setCredSuccess("");

    if (!credCurrentPassword) {
      setCredError("Current password is required.");
      setCredLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"}/api/auth/credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.token}`,
        },
        body: JSON.stringify({
          currentPassword: credCurrentPassword,
          newEmail: credNewEmail || undefined,
          newPassword: credNewPassword || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update credentials");
      }

      setCredSuccess("Credentials updated! Logging out...");
      setTimeout(() => {
        signOut({ callbackUrl: "/admin/login" });
      }, 2000);
    } catch (err: any) {
      setCredError(err.message);
    } finally {
      setCredLoading(false);
    }
  };

  // 4. CLOUDINARY MEDIA UPLOADS (UNSIGNED PRESET)
  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "productImages" | "productVideos" | "upiQr" | "heroBanner"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActionLoading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const fileToUpload of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Cloudinary upload failed. Check cloud name & upload preset in .env.local.");

        const uploadData = await res.json();
        uploadedUrls.push(uploadData.secure_url);
      }

      if (fieldName === "productImages") {
        setProductForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        triggerFeedback("success", `${uploadedUrls.length} image(s) uploaded to Cloudinary!`);
      } else if (fieldName === "productVideos") {
        setProductForm((prev) => ({ ...prev, videos: [...prev.videos, ...uploadedUrls] }));
        triggerFeedback("success", `${uploadedUrls.length} video(s) uploaded to Cloudinary!`);
      } else if (fieldName === "upiQr") {
        setSettings((prev: any) => ({ ...prev, upiQrCode: uploadedUrls[0] }));
        triggerFeedback("success", "UPI QR Code uploaded! Click Save Settings to apply.");
      } else if (fieldName === "heroBanner") {
        const file = files[0];
        const isVideo = file.type.startsWith("video/");
        setSettings((prev: any) => ({ 
          ...prev, 
          heroBannerUrl: uploadedUrls[0],
          heroBannerType: isVideo ? "video" : "image"
        }));
        triggerFeedback("success", "Hero Banner uploaded! Click Save Settings to apply.");
      }
    } catch (err: any) {
      triggerFeedback("error", `Upload failed: ${err.message}`);
    } finally {
      setActionLoading(false);
      e.target.value = "";
    }
  };

  const handleRemoveProductImage = (idx: number) => {
    setProductForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleRemoveProductVideo = (idx: number) => {
    setProductForm((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
  };

  // Filters for search
  const filteredOrders = orders.filter((order) => {
    const query = orderSearch.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.transactionId.toLowerCase().includes(query)
    );
  });

  // Calculate quick metrics
  const totalSalesCount = orders.filter((o) => o.status !== "Pending").length;
  const totalRevenue = orders
    .filter((o) => o.status === "Confirmed" || o.status === "Shipped" || o.status === "Delivered")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  // Wait until client is mounted to prevent hydration mismatch
  if (!mounted) {
    return null; // Server renders nothing; client starts from the same empty state
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-primary font-serif font-semibold">Verifying secure admin access...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="bg-cream min-h-screen flex flex-col font-sans">
      {/* Admin header */}
      <header className="bg-primary text-cream border-b-4 border-gold shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-cream text-primary rounded-full">
              <Package className="w-5 h-5" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-wide">
              Namas Mate <span className="text-gold">Admin</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-cream/70 block">
              Logged in: <span className="text-gold">{session?.user?.email}</span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="bg-gold hover:bg-gold-dark text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alerts */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 text-sm shadow-sm transition-all ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-primary-light rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-primary-light/50 font-bold uppercase tracking-wider block">
                Total Revenue
              </span>
              <span className="text-2xl font-extrabold text-primary">₹{totalRevenue}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-gold/20 text-gold-dark rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-primary-light/50 font-bold uppercase tracking-wider block">
                Verified Orders
              </span>
              <span className="text-2xl font-extrabold text-primary">{totalSalesCount}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-primary-light/50 font-bold uppercase tracking-wider block">
                Pending Verification
              </span>
              <span className="text-2xl font-extrabold text-primary">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-primary/10 space-x-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-primary-light/40 hover:text-primary"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-primary-light/40 hover:text-primary"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-primary-light/40 hover:text-primary"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
        </div>

        {/* TAB 1: ORDERS DASHBOARD */}
        {activeTab === "orders" && (
          <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-primary/5">
              <h2 className="font-serif text-2xl font-bold text-primary">Orders Database</h2>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-primary-light/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, UTR, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-sm text-primary placeholder:text-primary-light/40"
                />
              </div>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center py-12 text-primary-light">
                <Loader2 className="w-8 h-8 animate-spin text-gold mb-2" />
                <p className="text-sm font-medium">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-primary-light/60">
                No orders match your search or database is empty.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-cream border-b border-primary/10 text-primary-light/70 text-xs font-bold uppercase">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Delivery Address</th>
                      <th className="p-4">Product Purchased</th>
                      <th className="p-4">Transaction Details</th>
                      <th className="p-4">Verification Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={order?._id?.toString() ?? `order-${idx}`}
                        className="border-b border-primary/5 hover:bg-cream/40 text-primary text-xs"
                      >
                        <td className="p-4 space-y-1">
                          <p className="font-bold text-sm">{order.customerName}</p>
                          <p className="text-primary-light/80 font-medium">{order.email}</p>
                          <p className="text-primary-light/85 font-mono">{order.phone}</p>
                        </td>
                        <td className="p-4 leading-relaxed max-w-[200px] truncate-3-lines">
                          {order.address}, {order.city}, {order.state} - {order.pincode}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{order.productId?.name || "Deleted Product"}</p>
                          <p className="text-[10px] text-gold font-bold uppercase mt-1">₹{order.amount}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono bg-cream px-2.5 py-1.5 rounded-lg border border-primary/5 inline-block font-semibold">
                            {order.transactionId}
                          </p>
                        </td>
                        <td className="p-4">
                          <select
                            disabled={actionLoading}
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg font-bold border focus:outline-none text-[11px] ${
                              order.status === "Pending"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : order.status === "Confirmed"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : order.status === "Shipped"
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-purple-50 border-purple-200 text-purple-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleSendConfirmationEmail(order._id)}
                            className="bg-primary hover:bg-primary-dark text-gold font-bold px-3 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all w-full text-[10px]"
                            title="Send Manual Confirmation Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Confirmation</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === "products" && (
          <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-primary/5">
              <h2 className="font-serif text-2xl font-bold text-primary">Catalog</h2>
              <button
                onClick={openAddProductModal}
                className="gold-gradient text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex flex-col items-center py-12 text-primary-light">
                <Loader2 className="w-8 h-8 animate-spin text-gold mb-2" />
                <p className="text-sm font-medium">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-primary-light/60">
                No products found. Add one to list on the store front.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((prod, idx) => (
                  <div
                    key={prod?._id?.toString() ?? `prod-${idx}`}
                    className="border border-primary/10 rounded-2xl p-5 flex space-x-4 hover:shadow-md transition-all bg-cream/20"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative w-24 h-24 bg-cream rounded-xl overflow-hidden flex-shrink-0 border border-primary/5">
                      {prod.images && prod.images.length > 0 ? (
                        <Image
                          src={prod.images[0]}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">No media</div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-grow flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif font-bold text-primary text-base line-clamp-1">
                            {prod.name}
                          </h3>
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                              prod.isActive
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            {prod.isActive ? "Active" : "Draft"}
                          </span>
                        </div>
                        <p className="text-gold font-extrabold text-sm mt-0.5">₹{prod.price}</p>
                        <p className="text-xs text-primary-light/70 line-clamp-2 leading-relaxed mt-1.5">
                          {prod.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="bg-white border border-primary/20 hover:border-primary text-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod?._id ?? prod?.id)}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-6 max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-primary pb-4 border-b border-primary/5">
              System Settings
            </h2>

            {loadingSettings ? (
              <div className="flex flex-col items-center py-12 text-primary-light">
                <Loader2 className="w-8 h-8 animate-spin text-gold mb-2" />
                <p className="text-sm font-medium">Loading settings...</p>
              </div>
            ) : (
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                {/* UPI QR Code Cloudinary Upload */}
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-primary uppercase">
                    UPI QR Code Image (static checkout QR)
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Active QR View */}
                    <div className="relative w-40 h-40 bg-cream p-2 rounded-xl border border-primary/10 flex items-center justify-center overflow-hidden shadow-inner">
                      {settings.upiQrCode ? (
                        <Image
                          src={settings.upiQrCode}
                          alt="Settings UPI QR"
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="text-xs text-primary-light/40">No QR uploaded</span>
                      )}
                    </div>

                    {/* Upload File Input */}
                    <div className="space-y-2">
                      <label className="bg-white border border-primary/20 hover:border-gold cursor-pointer text-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-gold" />
                        <span>Upload QR to Cloudinary</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload(e, "upiQr")}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-primary-light/50 max-w-xs leading-relaxed">
                        Uploads directly using your Cloudinary credentials. File will update inside the form. Remember to click &quot;Save Settings&quot; to apply.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hero Banner Upload */}
                <div className="space-y-3 pt-6 border-t border-primary/5">
                  <span className="block text-xs font-bold text-primary uppercase">
                    Homepage Hero Banner (Image or Video)
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Active Banner View */}
                    <div className="relative w-40 h-40 bg-cream p-2 rounded-xl border border-primary/10 flex items-center justify-center overflow-hidden shadow-inner">
                      {settings.heroBannerUrl ? (
                        settings.heroBannerType === "video" ? (
                          <video src={settings.heroBannerUrl} className="object-cover w-full h-full rounded-lg" controls />
                        ) : (
                          <Image src={settings.heroBannerUrl} alt="Hero Banner" fill className="object-cover rounded-lg" />
                        )
                      ) : (
                        <span className="text-xs text-primary-light/40">No banner uploaded</span>
                      )}
                    </div>

                    {/* Upload File Input */}
                    <div className="space-y-2">
                      <label className="bg-white border border-primary/20 hover:border-gold cursor-pointer text-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-gold" />
                        <span>Upload Hero Banner</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleMediaUpload(e, "heroBanner")}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-primary-light/50 max-w-xs leading-relaxed">
                        Uploads directly to Cloudinary. It automatically detects if it is an image or a video. Click &quot;Save Settings&quot; to apply.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-primary/5">
                  {/* UPI Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="upiId" className="block text-xs font-bold text-primary uppercase">
                      UPI Handle ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      value={settings.upiId}
                      onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                      placeholder="e.g. pay@upi"
                      className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary font-medium text-sm bg-cream/10"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contactPhone" className="block text-xs font-bold text-primary uppercase">
                      Support Contact Phone
                    </label>
                    <input
                      type="text"
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary font-medium text-sm bg-cream/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5 max-w-md">
                  <label htmlFor="contactEmail" className="block text-xs font-bold text-primary uppercase">
                    Support Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="support@sujoodmate.com"
                    className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary font-medium text-sm bg-cream/10"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-primary hover:bg-primary-dark text-gold font-bold px-6 py-3.5 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Save Settings</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Product Editor Modal (Add/Edit) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-10">
          <div className="bg-white border border-primary/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 mb-10">
            <h3 className="font-serif text-2xl font-bold text-primary border-b border-primary/5 pb-3">
              {editingProduct ? "Edit Product Details" : "Add New Product"}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-5">

              {/* Product Name */}
              <div className="space-y-1">
                <label htmlFor="prodName" className="block text-xs font-bold text-primary uppercase">Product Title</label>
                <input
                  type="text" id="prodName" required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Orthopedic Memory Foam Mat"
                  className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10"
                />
              </div>

              {/* Price + Sale Price + Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prodPrice" className="block text-xs font-bold text-primary uppercase">Original Price (INR)</label>
                  <input
                    type="number" id="prodPrice" required min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1999"
                    className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="prodSalePrice" className="block text-xs font-bold text-primary uppercase">Sale Price (INR)</label>
                  <input
                    type="number" id="prodSalePrice" min="0"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                    placeholder="1499 (Optional)"
                    className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="prodShipping" className="block text-xs font-bold text-primary uppercase">Shipping (INR)</label>
                  <input
                    type="number" id="prodShipping" min="0"
                    value={productForm.shippingCharge}
                    onChange={(e) => setProductForm({ ...productForm, shippingCharge: e.target.value })}
                    placeholder="0 = Free"
                    className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="prodDesc" className="block text-xs font-bold text-primary uppercase">Description</label>
                <textarea
                  id="prodDesc" required rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Engineered memory foam with Turkish velvet surface..."
                  className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10 resize-none"
                />
              </div>

              {/* Variants */}
              <div className="space-y-1">
                <label htmlFor="prodVariants" className="block text-xs font-bold text-primary uppercase">
                  Variants <span className="normal-case text-primary-light/50 font-normal">(comma separated, optional)</span>
                </label>
                <input
                  type="text" id="prodVariants"
                  value={productForm.variants}
                  onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })}
                  placeholder="Emerald Green, Royal Blue, Crimson Red"
                  className="w-full px-4 py-2.5 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-sm bg-cream/10"
                />
              </div>

              {/* ── IMAGES ─────────────────────────────────────────────── */}
              <div className="space-y-3 border border-primary/10 rounded-2xl p-4 bg-cream/20">
                <span className="block text-xs font-bold text-primary uppercase">Product Images</span>

                {/* Existing thumbnails */}
                {productForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productForm.images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative w-16 h-16 bg-cream rounded-xl overflow-hidden border border-primary/10 group flex-shrink-0">
                        <Image src={img} alt="Product img" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload files (multiple) */}
                <label className="inline-flex bg-white border border-primary/20 hover:border-gold cursor-pointer text-primary px-3.5 py-2 rounded-xl text-xs font-bold items-center space-x-1.5 transition-all shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-gold" />
                  <span>Upload Images (select multiple)</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => handleMediaUpload(e, "productImages")} className="hidden" />
                </label>

                {/* Manual URL input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImageUrl())}
                    placeholder="Or paste Cloudinary / external image URL…"
                    className="flex-grow px-4 py-2 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-primary text-gold text-xs font-bold rounded-xl hover:bg-primary/90 transition-all whitespace-nowrap"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* ── VIDEOS ─────────────────────────────────────────────── */}
              <div className="space-y-3 border border-primary/10 rounded-2xl p-4 bg-cream/20">
                <span className="block text-xs font-bold text-primary uppercase">
                  Product Videos <span className="normal-case text-primary-light/50 font-normal">(optional)</span>
                </span>

                {/* Existing video list */}
                {productForm.videos.length > 0 && (
                  <ul className="space-y-1.5">
                    {productForm.videos.map((vid, idx) => (
                      <li key={`vid-${idx}`} className="flex items-center justify-between bg-white border border-primary/10 rounded-xl px-3 py-2 text-xs text-primary gap-2">
                        <span className="truncate max-w-[340px] font-mono text-[10px]">{vid}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProductVideo(idx)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Upload files (multiple) */}
                <label className="inline-flex bg-white border border-primary/20 hover:border-gold cursor-pointer text-primary px-3.5 py-2 rounded-xl text-xs font-bold items-center space-x-1.5 transition-all shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-gold" />
                  <span>Upload Videos (select multiple)</span>
                  <input type="file" accept="video/*" multiple onChange={(e) => handleMediaUpload(e, "productVideos")} className="hidden" />
                </label>

                {/* Manual URL input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVideoUrl())}
                    placeholder="Or paste Cloudinary / external video URL…"
                    className="flex-grow px-4 py-2 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddVideoUrl}
                    className="px-3 py-2 bg-primary text-gold text-xs font-bold rounded-xl hover:bg-primary/90 transition-all whitespace-nowrap"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* isActive toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox" id="isActive"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary border-primary/20 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-primary uppercase cursor-pointer">
                  Activate &amp; List Product on Store
                </label>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end items-center space-x-3 pt-4 border-t border-primary/5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-primary/10 hover:bg-cream text-primary rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={actionLoading}
                  className="bg-primary hover:bg-primary-dark text-gold font-bold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

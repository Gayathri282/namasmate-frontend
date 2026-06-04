import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductClient from "@/components/ProductClient";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Fresh details each time

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

async function getProductById(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const products = await res.json();
    return products.find((p: any) => p.id === id || p._id === id) || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product || !product.isActive) {
    return notFound();
  }

  // Ensure format is clean for client component
  const plainProduct = {
    id: product.id || product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice || 0,
    images: product.images,
    videos: product.videos || [],
    variants: product.variants || [],
  };

  return (
    <div className="bg-islamic-pattern min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductClient product={plainProduct} />
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CatalogProduct } from "./data/featured-products";

export type StoredCartItem = {
  id: string;
  productSlug: string;
  qty: number;
  sizeId: string;
  colorId: string;
  designId: string;
  personalName?: string | null;
};

const CART_KEY = "chichitos-cart";

function readRawCart(): StoredCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRawCart(items: StoredCartItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("chichitos-cart-updated"));
}

function subscribeToCart(callback: () => void) {
  window.addEventListener("chichitos-cart-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("chichitos-cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getCartSnapshot() {
  return typeof window === "undefined"
    ? "[]"
    : (window.localStorage.getItem(CART_KEY) ?? "[]");
}

export function getStoredCartItems() {
  return readRawCart();
}

export function clearStoredCart() {
  writeRawCart([]);
}

export function updateStoredCartItemQuantity(id: string, qty: number) {
  writeRawCart(
    readRawCart()
      .map((item) => (item.id === id ? { ...item, qty } : item))
      .filter((item) => item.qty > 0),
  );
}

export function removeStoredCartItem(id: string) {
  writeRawCart(readRawCart().filter((item) => item.id !== id));
}

export function addStoredCartItem(input: Omit<StoredCartItem, "id">) {
  const items = readRawCart();
  const existing = items.find(
    (item) =>
      item.productSlug === input.productSlug &&
      item.sizeId === input.sizeId &&
      item.colorId === input.colorId &&
      item.designId === input.designId &&
      (item.personalName ?? "") === (input.personalName ?? ""),
  );

  if (existing) {
    existing.qty = Math.min(existing.qty + input.qty, 20);
  } else {
    items.push({
      ...input,
      id: `${input.productSlug}-${input.sizeId}-${input.colorId}-${input.designId}-${Date.now()}`,
    });
  }

  writeRawCart(items);
}

function hydrateCartItemsFromRaw(items: StoredCartItem[], products: CatalogProduct[]) {
  return items
    .map((item) => {
      const product = products.find((candidate) => candidate.slug === item.productSlug);
      const size = product?.sizes.find((candidate) => candidate.id === item.sizeId);
      const color = product?.colors.find((candidate) => candidate.id === item.colorId);
      const design = product?.designs.find((candidate) => candidate.id === item.designId);

      if (!product || !size || !color || !design) return null;

      return {
        id: item.id,
        product,
        qty: item.qty,
        sizeLabel: size.label,
        sizeId: size.id,
        colorName: color.name,
        colorId: color.id,
        designName: design.name,
        designId: design.id,
        personalName: item.personalName ?? null,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function hydrateCartItems(products: CatalogProduct[]) {
  return hydrateCartItemsFromRaw(readRawCart(), products);
}

export function useHydratedCartItems(products: CatalogProduct[]) {
  const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");

  return useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot);
      return hydrateCartItemsFromRaw(Array.isArray(parsed) ? parsed : [], products);
    } catch {
      return [];
    }
  }, [products, snapshot]);
}

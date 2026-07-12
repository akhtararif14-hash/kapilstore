import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");

    if (!admin || admin.value !== process.env.ADMIN_KEY) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      actualPrice,
      images,
      category,
      subcategory,
      unit,
      variants,
    } = body;

    if (!title) {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanedImages = Array.isArray(images)
      ? images.filter((img) => img && img.trim() !== "")
      : [];

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      actualPrice: actualPrice ? Number(actualPrice) : undefined,
      images: cleanedImages,
      category: category || "stationery",
      subcategory: subcategory || "",
      unit: unit || "",
      variants: Array.isArray(variants) ? variants : [],
    });

    return Response.json(product, { status: 201 });

  } catch (err) {
    console.error("Add Product Error:", err);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");

    if (!admin || admin.value !== process.env.ADMIN_KEY) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    const products = await Product.find(query).sort({
      createdAt: -1,
    });

    return Response.json(products);

  } catch (err) {
    console.error("Get Products Error:", err);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// app/api/admin/pyqs/route.js

import { connectDB } from "@/lib/mongodb";
import PYQ from "../../../../models/PYQ";
import { cookies } from "next/headers";

// GET all PYQs (Admin)
export async function GET() {
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

    const pyqs = await PYQ.find().sort({
      createdAt: -1,
    });

    return Response.json(pyqs);

  } catch (err) {
    console.error("Get PYQs Error:", err);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Add New PYQ
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
      department,
      subject,
      subjectCode,
      branch,
      year,
      pdfUrl,
    } = body;

    if (
      !department ||
      !subject ||
      !subjectCode ||
      !branch ||
      !year ||
      !pdfUrl
    ) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const fileName = `${branch} - ${subject} - ${subjectCode}`;

    const pyq = await PYQ.create({
      department,
      subject,
      subjectCode,
      branch,
      year,
      pdfUrl,
      fileName,
    });

    return Response.json(pyq, {
      status: 201,
    });

  } catch (err) {
    console.error("Add PYQ Error:", err);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
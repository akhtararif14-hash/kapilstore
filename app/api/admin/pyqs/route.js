// app/api/admin/pyqs/route.js
import { connectDB } from "@/lib/mongodb";
import PYQ from "../../../../models/PYQ";

// GET all PYQs (admin)
export async function GET(req) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const pyqs = await PYQ.find().sort({ createdAt: -1 });
    return Response.json(pyqs);
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST - add new PYQ
export async function POST(req) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { department, subject, subjectCode, branch, year, pdfUrl } = body;

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
        { status: 400 },
      );
    }

    await connectDB();

    // Auto-generate filename: branch - Subject Name - Subject Code
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

    return Response.json(pyq, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

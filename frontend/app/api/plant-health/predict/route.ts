import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Call the backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8002";
    
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in plant health prediction:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}

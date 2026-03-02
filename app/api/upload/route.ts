import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock file validation
    const allowedTypes = {
      posture: ["image/jpeg", "image/png", "video/mp4"],
      skin: ["image/jpeg", "image/png"],
      eye: ["image/jpeg", "image/png"],
      mental: ["audio/mpeg", "audio/wav", "audio/mp3"],
    }

    const categoryTypes = allowedTypes[category as keyof typeof allowedTypes] || []

    if (!categoryTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type for ${category} analysis. Allowed types: ${categoryTypes.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Mock file size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "File size too large. Maximum size is 10MB",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      fileId: `${category}_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      message: "File uploaded successfully and ready for analysis",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
        message: "Please try again or contact support",
      },
      { status: 500 },
    )
  }
}

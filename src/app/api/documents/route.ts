import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const dataUrl = `${process.env.API_URL}data-2M.json`;

  console.log('started fetching', dataUrl);
  const response = await fetch(dataUrl, { cache: 'no-cache'});
  const documents = await response.json();
  console.log('started end', documents.length);

  return  NextResponse.json({ data: documents }, { status: 200 });
} 
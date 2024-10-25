import { NextRequest, NextResponse } from "next/server";
import data from "@/assets/data/document-list.mocked-data.json";
import { Document } from "@/app/[locale]/documents/documents.types";

export async function GET(request: NextRequest) {
  const documents = data as Document[];
  
  return  NextResponse.json({ data: documents }, { status: 200 });
}
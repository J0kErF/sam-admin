import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const resourceId = "053cea08-09bc-40ec-8f7a-156f0677aff3";
  const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${resourceId}&q=${query}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data.result.records);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {

    const { slug } = await params;

    
    const dataDirectory = path.join(process.cwd(), "src", "data", "tutorials");
    const fileContents = await fs.readFile(
      path.join(dataDirectory, `${slug}.json`),
      "utf8"
    );
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error(`API Error: Falha ao ler o arquivo:`, error);
    return NextResponse.json(
      { message: "Erro interno ao buscar dados do curso." },
      { status: 500 }
    );
  }
}

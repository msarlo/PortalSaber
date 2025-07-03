import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  try {
    // Este caminho agora vai funcionar porque o 'glpiData.json' está em 'src/data'
    const dataDirectory = path.join(process.cwd(), "src", "data");
    const fileContents = await fs.readFile(
      path.join(dataDirectory, "glpiData.json"),
      "utf8"
    );
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error: Falha ao ler o arquivo glpiData.json:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar dados do curso." },
      { status: 500 }
    );
  }
}

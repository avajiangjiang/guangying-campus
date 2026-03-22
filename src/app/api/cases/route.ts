import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CASES_FILE = path.join(process.cwd(), 'src/data/cases.json');

// 读取案例配置
export async function GET() {
  try {
    const data = await fs.readFile(CASES_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ cases: [] });
  }
}

// 保存案例配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证数据结构
    if (!body.cases || !Array.isArray(body.cases)) {
      return NextResponse.json({ error: '数据格式错误' }, { status: 400 });
    }
    
    // 写入文件
    await fs.writeFile(CASES_FILE, JSON.stringify(body, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}

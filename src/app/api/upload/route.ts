import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const endpointUrl = process.env.COZE_BUCKET_ENDPOINT_URL;
    const bucketName = process.env.COZE_BUCKET_NAME;
    
    if (!endpointUrl || !bucketName) {
      console.error('缺少对象存储配置');
      return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
    }

    const storage = new S3Storage({
      endpointUrl: endpointUrl,
      accessKey: '',
      secretKey: '',
      bucketName: bucketName,
      region: 'cn-beijing',
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 });
    }

    console.log('开始上传文件:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 生成文件名
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'mp4';
    const fileName = `cases/${timestamp}.${ext}`;
    
    // 上传到对象存储
    const key = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type || 'application/octet-stream',
    });
    
    console.log('上传成功, key:', key);
    
    // 生成访问 URL（有效期 30 天）
    const url = await storage.generatePresignedUrl({
      key: key,
      expireTime: 2592000, // 30 天
    });
    
    console.log('生成URL成功');
    
    return NextResponse.json({
      success: true,
      key: key,
      url: url,
      fileName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error('上传失败详情:', error);
    return NextResponse.json(
      { error: '上传失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}

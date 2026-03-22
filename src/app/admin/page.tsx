'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, Trash2, Edit, Plus, Save, ArrowLeft, Image, Video, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Case {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

const categories = ['毕业微电影', '专题片', '活动拍摄', '毕业相册'];

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('加载失败:', error);
      alert('加载案例数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (caseId: string, file: File) => {
    // 检查文件大小（最大100MB）
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('文件太大，请选择小于100MB的文件');
      return;
    }

    setUploadingId(caseId);
    setUploadProgress('准备上传...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadProgress(`正在上传: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setUploadProgress('上传成功，正在保存...');
        
        const updatedCases = cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                mediaUrl: data.url,
                mediaType: (file.type.startsWith('video') ? 'video' : 'image') as 'video' | 'image',
              }
            : c
        );
        setCases(updatedCases);
        await saveCases(updatedCases);
        setUploadProgress('');
        
        alert('上传成功！');
      } else {
        alert('上传失败: ' + (data.error || '未知错误'));
        setUploadProgress('');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请检查网络连接后重试');
      setUploadProgress('');
    } finally {
      setUploadingId(null);
    }
  };

  const saveCases = async (updatedCases: Case[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: updatedCases }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCase = () => {
    const newCase: Case = {
      id: Date.now().toString(),
      title: '新案例',
      category: '活动拍摄',
      description: '请编辑描述',
      mediaUrl: '',
      mediaType: 'image',
    };
    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    saveCases(updatedCases);
  };

  const deleteCase = (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    const updatedCases = cases.filter((c) => c.id !== id);
    setCases(updatedCases);
    saveCases(updatedCases);
  };

  const editCase = (caseItem: Case) => {
    setCurrentCase({ ...caseItem });
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!currentCase) return;
    const updatedCases = cases.map((c) =>
      c.id === currentCase.id ? currentCase : c
    );
    setCases(updatedCases);
    saveCases(updatedCases);
    setEditDialogOpen(false);
    setCurrentCase(null);
  };

  const updateMediaUrl = (id: string, url: string) => {
    const isVideo = url.match(/\.(mp4|mov|avi|webm|mkv)(\?|$)/i) || url.includes('video');
    const updatedCases = cases.map((c) =>
      c.id === id ? { ...c, mediaUrl: url, mediaType: (isVideo ? 'video' : 'image') as 'video' | 'image' } : c
    );
    setCases(updatedCases);
  };

  // 触发文件选择
  const triggerFileInput = (caseId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleUpload(caseId, file);
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <div className="text-slate-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">案例管理后台</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                预览网站
              </Button>
            </Link>
            <Button onClick={addCase} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加案例
            </Button>
          </div>
        </div>
      </header>

      {/* 上传进度提示 */}
      {uploadingId && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">使用说明</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• <strong>方式一</strong>：点击「上传文件」按钮选择本地的图片或视频（支持100MB以内）</li>
            <li>• <strong>方式二</strong>：在「媒体链接」输入框粘贴已有的图片/视频URL链接</li>
            <li>• 上传成功后会自动保存，可返回首页预览效果</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="overflow-hidden">
              {/* 媒体预览 */}
              <div className="aspect-video bg-slate-100 relative group">
                {caseItem.mediaUrl ? (
                  caseItem.mediaType === 'video' ? (
                    <video
                      src={caseItem.mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={caseItem.mediaUrl}
                      alt={caseItem.title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    {caseItem.mediaType === 'video' ? (
                      <Video className="w-12 h-12 mb-2" />
                    ) : (
                      <Image className="w-12 h-12 mb-2" />
                    )}
                    <span className="text-sm">暂无媒体</span>
                  </div>
                )}
                
                {/* 上传遮罩 */}
                {!uploadingId && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      onClick={() => triggerFileInput(caseItem.id)}
                      className="bg-white text-slate-900 hover:bg-slate-100"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      上传文件
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {caseItem.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {caseItem.mediaType === 'video' ? '视频' : '图片'}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                  {caseItem.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {caseItem.description}
                </p>

                {/* 媒体链接输入 */}
                <div className="mb-3">
                  <Label className="text-xs text-slate-500">媒体链接（可粘贴URL）</Label>
                  <Input
                    value={caseItem.mediaUrl}
                    onChange={(e) => updateMediaUrl(caseItem.id, e.target.value)}
                    onBlur={() => saveCases(cases)}
                    placeholder="粘贴图片或视频链接"
                    className="mt-1 text-sm"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => editCase(caseItem)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteCase(caseItem.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑案例</DialogTitle>
          </DialogHeader>
          {currentCase && (
            <div className="space-y-4 py-4">
              <div>
                <Label>案例标题</Label>
                <Input
                  value={currentCase.title}
                  onChange={(e) =>
                    setCurrentCase({ ...currentCase, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>分类</Label>
                <Select
                  value={currentCase.category}
                  onValueChange={(value) =>
                    setCurrentCase({ ...currentCase, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>描述</Label>
                <Textarea
                  value={currentCase.description}
                  onChange={(e) =>
                    setCurrentCase({ ...currentCase, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 保存状态提示 */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Save className="w-4 h-4 animate-pulse" />
          正在保存...
        </div>
      )}
    </div>
  );
}

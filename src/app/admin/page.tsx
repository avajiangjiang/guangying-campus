'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Upload, Trash2, Edit, Plus, Save, ArrowLeft, Image, Video } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载案例数据
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
    } finally {
      setLoading(false);
    }
  };

  // 上传文件
  const handleUpload = async (caseId: string, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        // 更新案例的媒体URL
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
        // 自动保存
        await saveCases(updatedCases);
      } else {
        alert('上传失败: ' + data.error);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 保存案例
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
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 添加新案例
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

  // 删除案例
  const deleteCase = (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    const updatedCases = cases.filter((c) => c.id !== id);
    setCases(updatedCases);
    saveCases(updatedCases);
  };

  // 编辑案例
  const editCase = (caseItem: Case) => {
    setCurrentCase({ ...caseItem });
    setEditDialogOpen(true);
  };

  // 保存编辑
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

  // 手动输入URL
  const updateMediaUrl = (id: string, url: string, type: 'image' | 'video') => {
    const updatedCases = cases.map((c) =>
      c.id === id ? { ...c, mediaUrl: url, mediaType: type } : c
    );
    setCases(updatedCases);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
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
            <h1 className="text-xl font-bold text-slate-900">案例管理</h1>
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

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 点击案例卡片上的「上传」按钮可以上传图片或视频</li>
            <li>• 也可以直接在「媒体链接」输入框中粘贴已有的图片/视频URL</li>
            <li>• 点击「编辑」按钮可以修改案例的标题、分类和描述</li>
            <li>• 所有更改会自动保存</li>
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
                    />
                  ) : (
                    <img
                      src={caseItem.mediaUrl}
                      alt={caseItem.title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    {caseItem.mediaType === 'video' ? (
                      <Video className="w-12 h-12" />
                    ) : (
                      <Image className="w-12 h-12" />
                    )}
                  </div>
                )}
                
                {/* 上传按钮 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*,video/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleUpload(caseItem.id, file);
                      };
                      input.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    上传文件
                  </Button>
                </div>
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
                  <Label className="text-xs text-slate-500">媒体链接（可直接粘贴URL）</Label>
                  <Input
                    value={caseItem.mediaUrl}
                    onChange={(e) =>
                      updateMediaUrl(
                        caseItem.id,
                        e.target.value,
                        e.target.value.match(/\.(mp4|mov|avi|webm)$/i)
                          ? 'video'
                          : 'image'
                      )
                    }
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
                    className="text-red-600 hover:text-red-700"
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

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Video, BookOpen, Film, Menu, X, ChevronRight, Image, Play } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

// 视频播放组件
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNativeControls, setShowNativeControls] = useState(false);

  const togglePlay = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 如果已显示原生控件，则不需要自定义控制
    if (showNativeControls) return;
    
    if (!videoRef.current) return;
    
    try {
      if (videoRef.current.paused) {
        // iOS 需要在用户交互中调用 play()
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('视频播放失败，切换到原生控件:', err);
      // 如果自定义播放失败，切换到原生控件
      setShowNativeControls(true);
      setHasError(false);
      // 延迟一帧后尝试播放
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => setHasError(true));
        }
      }, 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div 
      className="relative w-full h-full"
      onClick={togglePlay}
      onTouchEnd={togglePlay}
    >
      <video 
        ref={videoRef}
        src={src} 
        className="w-full h-full object-cover" 
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-playsinline="true"
        preload="auto"
        controls={showNativeControls}
        poster=""
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
      />
      
      {/* 加载中状态 */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* 播放按钮 - 仅在暂停时显示，且未显示原生控件时 */}
      {!isPlaying && !hasError && !isLoading && !showNativeControls && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
            <Play className="w-6 h-6 md:w-7 md:h-7 text-slate-800 ml-1" />
          </div>
        </div>
      )}
      
      {/* 错误提示 - 点击可重试 */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={() => {
            setHasError(false);
            setShowNativeControls(true);
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.load();
              }
            }, 100);
          }}
        >
          <div className="text-white text-xs text-center px-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6" />
            </div>
            点击重试
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        setCases(data.cases || []);
      })
      .catch((err) => console.error('加载案例失败:', err))
      .finally(() => setCasesLoading(false));
  }, []);

  const services = [
    { icon: Camera, title: '校园活动拍摄', description: '运动会、文艺汇演等各类校园活动摄影摄像' },
    { icon: Video, title: '专题片拍摄', description: '学校宣传片、招生片、校园文化专题片' },
    { icon: BookOpen, title: '毕业相册', description: '个性化毕业相册设计制作，珍藏青春记忆' },
    { icon: Film, title: '毕业微电影', description: '创意微电影拍摄，讲述青春故事' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                光影校园影像
              </span>
            </div>
            
            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">关于我们</button>
              <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">服务内容</button>
              <button onClick={() => scrollToSection('albums')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">相册展示</button>
              <button onClick={() => scrollToSection('cases')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">案例展示</button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                立即咨询
              </Button>
            </div>

            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-4 py-3 space-y-1">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2.5 text-slate-600 text-sm">关于我们</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2.5 text-slate-600 text-sm">服务内容</button>
              <button onClick={() => scrollToSection('albums')} className="block w-full text-left py-2.5 text-slate-600 text-sm">相册展示</button>
              <button onClick={() => scrollToSection('cases')} className="block w-full text-left py-2.5 text-slate-600 text-sm">案例展示</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2.5 text-slate-600 text-sm">联系我们</button>
              <div className="pt-2">
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600">立即咨询</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero 区域 */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-bold text-slate-900 mb-3 md:mb-6 leading-tight">
              记录青春岁月
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                定格美好时光
              </span>
            </h1>
            <p className="text-sm md:text-lg text-slate-500 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
              专业校园影像拍摄服务，提供活动拍摄、专题片制作、毕业相册、毕业微电影等全方位解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => scrollToSection('cases')} size="sm" className="md:size-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm md:text-base px-6 md:px-8">
                查看案例
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
              <Button onClick={() => scrollToSection('contact')} size="sm" variant="outline" className="md:size-lg text-sm md:text-base px-6 md:px-8">
                立即咨询
              </Button>
            </div>
            
            {/* 数据展示 */}
            <div className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="py-3">
                <div className="text-2xl md:text-4xl font-bold text-blue-600">10+</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">年行业经验</div>
              </div>
              <div className="py-3">
                <div className="text-2xl md:text-4xl font-bold text-purple-600">500+</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">合作学校</div>
              </div>
              <div className="py-3">
                <div className="text-2xl md:text-4xl font-bold text-pink-600">10000+</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">服务师生</div>
              </div>
              <div className="py-3">
                <div className="text-2xl md:text-4xl font-bold text-indigo-600">100%</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1">客户满意度</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="about" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center md:text-left md:grid md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6">
                关于<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">光影校园影像</span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 mb-4 leading-relaxed">
                光影校园影像成立于2014年，是一家专注于校园影像拍摄的专业机构。十余年来，我们始终秉承"记录青春、传递美好"的理念，为数百家学校提供高品质的影像服务。
              </p>
              <p className="hidden md:block text-slate-500 mb-6 leading-relaxed">
                我们拥有一支由资深摄影师、摄像师、后期制作人员组成的专业团队，配备先进的拍摄设备和完善的后期制作系统。
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 md:space-y-0">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs md:text-sm text-slate-700">专业团队</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                  <Video className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs md:text-sm text-slate-700">设备先进</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-full">
                  <Film className="w-3.5 h-3.5 text-pink-600" />
                  <span className="text-xs md:text-sm text-slate-700">创意定制</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-slate-400">专业拍摄团队</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务内容 */}
      <section id="services" className="py-6 md:py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">
              我们的<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">服务内容</span>
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500">
              全方位校园影像拍摄服务
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {services.map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 md:p-4 transition-all duration-300 ${
                  index === 0 ? 'bg-blue-50 hover:bg-blue-100' : 
                  index === 1 ? 'bg-purple-50 hover:bg-purple-100' : 
                  index === 2 ? 'bg-pink-50 hover:bg-pink-100' : 'bg-indigo-50 hover:bg-indigo-100'
                }`}>
                  <service.icon className={`w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 ${
                    index === 0 ? 'text-blue-600' : 
                    index === 1 ? 'text-purple-600' : 
                    index === 2 ? 'text-pink-600' : 'text-indigo-600'
                  }`} />
                  <h3 className="text-[10px] md:text-sm font-medium text-slate-900 text-center leading-tight">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 案例展示 */}
      <section id="cases" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4">
              精选<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">案例展示</span>
            </h2>
            <p className="text-xs md:text-base text-slate-500 max-w-xl mx-auto">
              每一部作品都是我们用心创作的成果
            </p>
          </div>

          {casesLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">加载中...</div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">暂无案例</div>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:gap-6">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="overflow-hidden group cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
                    {caseItem.mediaUrl ? (
                      caseItem.mediaType === 'video' ? (
                        <VideoPlayer src={caseItem.mediaUrl} />
                      ) : (
                        <img src={caseItem.mediaUrl} alt={caseItem.title} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="flex flex-col items-center gap-0.5 md:gap-1">
                        {caseItem.mediaType === 'video' ? (
                          <>
                            <Video className="w-5 h-5 md:w-10 md:h-10 text-slate-300" />
                            <span className="text-[8px] md:text-xs text-slate-400">待上传视频</span>
                          </>
                        ) : (
                          <>
                            <Image className="w-5 h-5 md:w-10 md:h-10 text-slate-300" />
                            <span className="text-[8px] md:text-xs text-slate-400">待上传图片</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-1.5 md:p-4">
                    <div className="flex items-center gap-1 mb-1 md:mb-2">
                      <span className="text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                        {caseItem.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 text-[10px] md:text-base line-clamp-1">{caseItem.title}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 hidden md:block">{caseItem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 相册展示 */}
      <section id="albums" className="py-12 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4">
              精品<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">相册展示</span>
            </h2>
            <p className="text-xs md:text-base text-slate-500 max-w-xl mx-auto">
              多种风格相册任您选择，珍藏青春美好时光
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: '经典纪念版', price: '¥298起', desc: '简约大气，永恒经典', color: 'from-blue-100 to-blue-50' },
              { name: '青春活力版', price: '¥398起', desc: '活泼色彩，青春气息', color: 'from-purple-100 to-purple-50' },
              { name: '文艺清新版', price: '¥358起', desc: '文艺风格，清新淡雅', color: 'from-pink-100 to-pink-50' },
              { name: '高端定制版', price: '¥598起', desc: '奢华质感，专属定制', color: 'from-amber-100 to-amber-50' },
            ].map((album, index) => (
              <Card key={index} className="group cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`aspect-square bg-gradient-to-br ${album.color} flex items-center justify-center relative`}>
                  <div className="text-center">
                    <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-slate-400 mx-auto mb-1" />
                    <span className="text-[10px] md:text-xs text-slate-400">相册预览</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs md:text-sm font-medium px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                      查看详情
                    </span>
                  </div>
                </div>
                <CardContent className="p-3 md:p-4">
                  <h3 className="font-semibold text-slate-900 text-sm md:text-base mb-0.5 md:mb-1">{album.name}</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 mb-1.5 md:mb-2">{album.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-sm md:text-base">{album.price}</span>
                    <Button size="sm" variant="ghost" className="text-[10px] md:text-xs text-slate-500 hover:text-blue-600 p-0 h-auto">
                      了解更多
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="py-8 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">
              服务<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">流程</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500">规范化的服务流程，确保高质量交付</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[
              { step: '01', title: '需求沟通', desc: '了解需求' },
              { step: '02', title: '方案策划', desc: '制定方案' },
              { step: '03', title: '拍摄执行', desc: '现场拍摄' },
              { step: '04', title: '后期交付', desc: '成品交付' },
            ].map((item, index) => (
              <div key={index} className="text-center p-3 md:p-4 rounded-xl bg-white border border-slate-100">
                <div className="text-2xl md:text-3xl font-bold text-slate-200 mb-0.5 md:mb-1">{item.step}</div>
                <h3 className="text-xs md:text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden md:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer id="contact" className="bg-slate-900 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">光影校园影像</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                专业校园影像拍摄服务机构，记录青春岁月，定格美好时光。
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">服务内容</h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>校园活动拍摄</li>
                <li>专题片拍摄</li>
                <li>毕业相册</li>
                <li>毕业微电影</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">关于我们</h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>公司介绍</li>
                <li>团队介绍</li>
                <li>合作伙伴</li>
                <li>加入我们</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">联系方式</h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>电话：400-888-8888</li>
                <li>邮箱：contact@guangying.com</li>
                <li>地址：北京市朝阳区</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs">
            <p>© 2024 光影校园影像. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

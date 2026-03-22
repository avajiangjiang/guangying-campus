'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Video, BookOpen, Film, Phone, Mail, MapPin, Menu, X, ChevronRight, Image, Play } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);

  // 加载案例数据
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
    {
      icon: Camera,
      title: '校园活动拍摄',
      description: '运动会、文艺汇演、开学典礼、毕业典礼等各类校园活动专业摄影摄像服务',
    },
    {
      icon: Video,
      title: '专题片拍摄',
      description: '学校宣传片、招生宣传片、校园文化专题片、教师风采展示片等专业制作',
    },
    {
      icon: BookOpen,
      title: '毕业相册',
      description: '个性化毕业相册设计与制作，记录班级美好时光，珍藏青春记忆',
    },
    {
      icon: Film,
      title: '毕业微电影',
      description: '创意毕业微电影拍摄，用影像讲述青春故事，留下难忘的毕业纪念',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                光影校园影像
              </span>
            </div>
            
            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-blue-600 transition-colors">关于我们</button>
              <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-blue-600 transition-colors">服务内容</button>
              <button onClick={() => scrollToSection('cases')} className="text-slate-600 hover:text-blue-600 transition-colors">案例展示</button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-blue-600 transition-colors">联系我们</button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                立即咨询
              </Button>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-slate-600">关于我们</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-slate-600">服务内容</button>
              <button onClick={() => scrollToSection('cases')} className="block w-full text-left py-2 text-slate-600">案例展示</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-slate-600">联系我们</button>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">立即咨询</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero 区域 */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              记录青春岁月
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                定格美好时光
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              专业校园影像拍摄服务，为学校提供活动拍摄、专题片制作、毕业相册、毕业微电影等全方位影像解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8">
                查看案例
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                立即咨询
              </Button>
            </div>
            
            {/* 数据展示 */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600">10+</div>
                <div className="text-slate-600 mt-1">年行业经验</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600">500+</div>
                <div className="text-slate-600 mt-1">合作学校</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-pink-600">10000+</div>
                <div className="text-slate-600 mt-1">服务师生</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600">100%</div>
                <div className="text-slate-600 mt-1">客户满意度</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                关于<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">光影校园影像</span>
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                光影校园影像成立于2014年，是一家专注于校园影像拍摄的专业机构。十余年来，我们始终秉承"记录青春、传递美好"的理念，为数百家学校提供高品质的影像服务。
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                我们拥有一支由资深摄影师、摄像师、后期制作人员组成的专业团队，配备先进的拍摄设备和完善的后期制作系统，能够满足各类校园影像拍摄需求。
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">专业团队，经验丰富</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-slate-700">设备先进，品质保障</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Film className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-slate-700">创意独特，定制服务</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-slate-500">专业拍摄团队</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务内容 */}
      <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              我们的<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">服务内容</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              为学校提供全方位的校园影像拍摄服务，从活动记录到创意制作，满足您的所有需求
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-none shadow-md">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    index === 0 ? 'bg-blue-100' :
                    index === 1 ? 'bg-purple-100' :
                    index === 2 ? 'bg-pink-100' : 'bg-indigo-100'
                  }`}>
                    <service.icon className={`w-7 h-7 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-purple-600' :
                      index === 2 ? 'text-pink-600' : 'text-indigo-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 案例展示 */}
      <section id="cases" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              精选<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">案例展示</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              每一部作品都是我们用心创作的成果，用镜头记录校园的美好瞬间
            </p>
          </div>

          {casesLoading ? (
            <div className="text-center py-12 text-slate-500">加载中...</div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 text-slate-500">暂无案例</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="overflow-hidden group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    {caseItem.mediaUrl ? (
                      caseItem.mediaType === 'video' ? (
                        <video
                          src={caseItem.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          poster="/video-placeholder.jpg"
                        />
                      ) : (
                        <img
                          src={caseItem.mediaUrl}
                          alt={caseItem.title}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {caseItem.mediaType === 'video' ? (
                          <Video className="w-12 h-12 text-blue-400" />
                        ) : (
                          <Image className="w-12 h-12 text-blue-400" />
                        )}
                        <span className="text-sm text-slate-400">暂无媒体</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                        {caseItem.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {caseItem.mediaType === 'video' ? '视频' : '图片'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-lg line-clamp-1">{caseItem.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{caseItem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 服务流程 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              服务<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">流程</span>
            </h2>
            <p className="text-slate-600 text-sm">
              规范化的服务流程，确保每个项目高质量交付
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: '需求沟通', desc: '了解您的具体需求' },
              { step: '02', title: '方案策划', desc: '制定拍摄方案和预算' },
              { step: '03', title: '拍摄执行', desc: '专业团队现场拍摄' },
              { step: '04', title: '后期交付', desc: '精细制作并交付' },
            ].map((item, index) => (
              <div key={index} className="relative text-center p-4 rounded-xl bg-slate-50">
                <div className="text-4xl font-bold text-blue-200 mb-1">{item.step}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section id="contact" className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                联系我们
              </h2>
              <p className="text-slate-300 mb-6 text-sm">
                如果您对我们的服务感兴趣，欢迎随时联系我们。我们将为您提供专业的咨询和定制化的解决方案。
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">咨询热线</div>
                    <div className="text-white font-semibold">400-888-8888</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">电子邮箱</div>
                    <div className="text-white font-semibold">contact@guangying.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">公司地址</div>
                    <div className="text-white font-semibold">北京市朝阳区某某大厦A座</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">快速咨询</h3>
              <form className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="您的姓名"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="学校名称"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="联系电话"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="请描述您的需求..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-5">
                  提交咨询
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">光影校园影像</span>
              </div>
              <p className="text-slate-400 text-sm">
                专业校园影像拍摄服务机构，记录青春岁月，定格美好时光。
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">服务内容</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>校园活动拍摄</li>
                <li>专题片拍摄</li>
                <li>毕业相册</li>
                <li>毕业微电影</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>公司介绍</li>
                <li>团队介绍</li>
                <li>合作伙伴</li>
                <li>加入我们</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">联系方式</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>电话：400-888-8888</li>
                <li>邮箱：contact@guangying.com</li>
                <li>地址：北京市朝阳区</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 光影校园影像. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

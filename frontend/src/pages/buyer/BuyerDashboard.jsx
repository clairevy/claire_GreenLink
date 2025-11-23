import React from "react";
import { Link } from "react-router-dom";
// shadcn/ui components are assumed available in the project
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Local image uploaded by user (used as logo / hero image)
const LOGO_URL = "/mnt/data/ABOUT US (1).png";

const stats = [
  { id: 1, title: "Yêu cầu đang mở", value: 3 },
  { id: 2, title: "Báo giá mới", value: 7 },
  { id: 3, title: "Đơn đang xử lý", value: 2 },
  { id: 4, title: "Đơn hoàn tất tháng này", value: 5 },
];

const recentActivities = [
  { id: 1, text: "HTX Nam Hòa gửi báo giá cho RQ-201", time: "5 phút" },
  { id: 2, text: "Đơn OD-112 đã chuyển sang 'Đang giao'", time: "1 giờ" },
  { id: 3, text: "RQ-119 sắp hết hạn nhận báo giá", time: "3 giờ" },
];

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-72 bg-white border-r h-screen sticky top-0">
          <div className="px-6 py-6 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={LOGO_URL} alt="Logo" />
              <AvatarFallback>GB</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold">GreenBanana</h4>
              <p className="text-xs text-muted-foreground">Buyer Center</p>
            </div>
          </div>

          <Separator />

          <nav className="px-4 py-6">
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Dashboard
                </a>
              </li>
               <li>
                <Link
                  to="/buyer/posts"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Tạo yêu cầu
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Yêu cầu của tôi
                </a>
              </li>
             
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Báo giá đã nhận
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Đơn hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Tra cứu nguồn gốc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Lịch sử giao dịch
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Đánh giá & Phản hồi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Thông báo
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Tổng quan hoạt động và thông tin quan trọng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Tìm yêu cầu, HTX, sản phẩm..."
                className="w-96"
              />
              <Button variant="outline">Tạo Yêu Cầu</Button>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <Card key={s.id} className="p-4">
                <CardHeader className="p-0">
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-3">
                  <div className="text-2xl font-bold">{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Charts + Recent Activities */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí mua hàng (6 tháng)</CardTitle>
                  <CardDescription>
                    Biểu đồ minh họa (placeholder)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-56 flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">
                    [Chart placeholder]
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <ul className="space-y-3">
                      {recentActivities.map((a) => (
                        <li key={a.id} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                            A
                          </div>
                          <div>
                            <div className="text-sm">{a.text}</div>
                            <div className="text-xs text-muted-foreground">
                              {a.time} trước
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right column: Quick Actions + Incoming Quotes */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hành động nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col">
                    <Button className="mb-2">+ Tạo Yêu Cầu Mới</Button>
                    <Button variant="ghost">Xem Báo Giá Mới</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Báo giá mới</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">HTX Nam Hòa</div>
                        <div className="text-xs text-muted-foreground">
                          Rau Muống • RQ-201
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold">
                          12.000 VND / kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          5 phút trước
                        </div>
                      </div>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">HTX Tân Lập</div>
                        <div className="text-xs text-muted-foreground">
                          Cải Ngọt • RQ-198
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold">
                          14.500 VND / kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          20 phút trước
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông báo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>RQ-122 - Hết hạn sau 4 giờ</li>
                    <li>OD-112 - Đã xuất kho</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gợi ý HTX phù hợp</CardTitle>
                <CardDescription>
                  HTX gần địa điểm giao hàng hoặc có lịch sử chất lượng tốt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-slate-100" />
                        <div>
                          <div className="font-medium">HTX Gợi ý {i + 1}</div>
                          <div className="text-xs text-muted-foreground">
                            Rau Muống • Đánh giá 4.6
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

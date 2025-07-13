import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/hooks/use-toast';
import { User, Phone, Shield, Settings } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().min(9, 'رقم الهاتف يجب أن يكون 9 أرقام على الأقل'),
});

type ProfileForm = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, updateProfile, logout, permissions } = useAuthStore();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      updateProfile(data);
      toast({
        title: "تم تحديث البيانات",
        description: "تم حفظ معلومات الحساب بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً",
    });
  };

  const getRoleDisplayName = (role: string) => {
    return role === 'ShopOwner' ? 'صاحب المتجر' : 'عامل';
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'ShopOwner' ? 'default' : 'secondary';
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">بيانات الحساب</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
            <CardDescription>
              يمكنك تحديث معلومات حسابك من هنا
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">الاسم</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="أدخل اسمك"
                            className="text-right pr-10"
                            dir="rtl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">رقم الهاتف</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="123456789"
                            className="text-right pr-10"
                            dir="rtl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  حفظ التغييرات
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Role and Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              الصلاحيات والأذونات
            </CardTitle>
            <CardDescription>
              عرض دورك والصلاحيات المتاحة لك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الدور:</span>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">الصلاحيات المتاحة:</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>لوحة التحكم</span>
                  <Badge variant={permissions?.dashboard ? "default" : "outline"}>
                    {permissions?.dashboard ? "متاح" : "غير متاح"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>إدارة المنتجات</span>
                  <Badge variant={permissions?.products.add ? "default" : "outline"}>
                    {permissions?.products.add ? "كامل" : "قراءة فقط"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>المبيعات</span>
                  <Badge variant={permissions?.sales.create ? "default" : "outline"}>
                    {permissions?.sales.create ? "متاح" : "غير متاح"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>المشتريات</span>
                  <Badge variant={permissions?.purchases.create ? "default" : "outline"}>
                    {permissions?.purchases.create ? "متاح" : "غير متاح"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>التقارير</span>
                  <Badge variant={permissions?.reports ? "default" : "outline"}>
                    {permissions?.reports ? "متاح" : "غير متاح"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>الإعدادات</span>
                  <Badge variant={permissions?.settings ? "default" : "outline"}>
                    {permissions?.settings ? "متاح" : "غير متاح"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
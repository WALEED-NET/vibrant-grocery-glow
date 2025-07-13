import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Settings, Shield, Eye, Plus, Edit, Trash2, ShoppingCart, Package, BarChart3 } from 'lucide-react';
import { UserRole, Permission, DEFAULT_PERMISSIONS } from '@/types/user';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

const UserManagementPage = () => {
  const { user, hasPermission } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Worker');
  const [customPermissions, setCustomPermissions] = useState<Permission>(DEFAULT_PERMISSIONS.Worker);
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ name: '', phone: '', password: '', role: 'Worker' as UserRole });

  // Mock users data - in real app this would come from a store/API
  const [users] = useState([
    { id: '1', name: 'محمد أحمد', phone: '123456789', role: 'ShopOwner' as UserRole, active: true },
    { id: '2', name: 'علي محمود', phone: '987654321', role: 'Worker' as UserRole, active: true },
    { id: '3', name: 'سارة أحمد', phone: '555666777', role: 'Worker' as UserRole, active: false },
  ]);

  if (!hasPermission('settings')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">غير مصرح لك</h3>
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى إدارة المستخدمين</p>
        </div>
      </div>
    );
  }

  const handlePermissionChange = (section: string, permission: string, value: boolean) => {
    setCustomPermissions(prev => ({
      ...prev,
      [section]: typeof prev[section as keyof Permission] === 'object' 
        ? { ...prev[section as keyof Permission] as any, [permission]: value }
        : value
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setCustomPermissions(DEFAULT_PERMISSIONS[role]);
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.phone || !newUser.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    toast.success(`تم إنشاء المستخدم ${newUser.name} بنجاح`);
    setNewUserDialog(false);
    setNewUser({ name: '', phone: '', password: '', role: 'Worker' });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };

  const renderPermissionSwitch = (label: string, section: string, permission?: string, checked?: boolean) => (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor={`${section}-${permission || 'main'}`} className="text-sm">
        {label}
      </Label>
      <Switch
        id={`${section}-${permission || 'main'}`}
        checked={checked ?? (permission ? 
          (customPermissions[section as keyof Permission] as any)?.[permission] : 
          customPermissions[section as keyof Permission] as boolean)}
        onCheckedChange={(value) => handlePermissionChange(section, permission || '', value)}
      />
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إدارة المستخدمين والصلاحيات</p>
        </div>
        
        <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 ml-2" />
              إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border shadow-xl">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="كلمة المرور"
                />
              </div>
              <div>
                <Label htmlFor="role">الدور</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[9999]">
                    <SelectItem value="ShopOwner">مالك المتجر</SelectItem>
                    <SelectItem value="Worker">موظف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                إنشاء المستخدم
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              قائمة المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                    <Badge variant={user.role === 'ShopOwner' ? 'default' : 'secondary'} className="text-xs mt-1">
                      {user.role === 'ShopOwner' ? 'مالك المتجر' : 'موظف'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.active ? 'default' : 'secondary'}>
                      {user.active ? 'نشط' : 'معطل'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              صلاحيات الأدوار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-select">اختر الدور</Label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[9999]">
                    <SelectItem value="ShopOwner">مالك المتجر</SelectItem>
                    <SelectItem value="Worker">موظف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                {/* Dashboard Access */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    لوحة التحكم
                  </h4>
                  {renderPermissionSwitch('الوصول للوحة التحكم الرئيسية', 'dashboard')}
                </div>

                <Separator />

                {/* Products */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    المنتجات
                  </h4>
                  {renderPermissionSwitch('عرض المنتجات', 'products', 'view')}
                  {renderPermissionSwitch('إضافة منتجات', 'products', 'add')}
                  {renderPermissionSwitch('تعديل المنتجات', 'products', 'edit')}
                  {renderPermissionSwitch('حذف المنتجات', 'products', 'delete')}
                </div>

                <Separator />

                {/* Sales */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    المبيعات
                  </h4>
                  {renderPermissionSwitch('عرض المبيعات', 'sales', 'view')}
                  {renderPermissionSwitch('إنشاء مبيعات', 'sales', 'create')}
                </div>

                <Separator />

                {/* Purchases */}
                <div>
                  <h4 className="font-medium mb-2">المشتريات</h4>
                  {renderPermissionSwitch('عرض المشتريات', 'purchases', 'view')}
                  {renderPermissionSwitch('إنشاء مشتريات', 'purchases', 'create')}
                </div>

                <Separator />

                {/* Other Permissions */}
                <div>
                  <h4 className="font-medium mb-2">صلاحيات أخرى</h4>
                  {renderPermissionSwitch('إدارة المخزون', 'inventory', 'manage')}
                  {renderPermissionSwitch('التقارير', 'reports')}
                  {renderPermissionSwitch('الإعدادات', 'settings')}
                  {renderPermissionSwitch('أسعار الصرف', 'exchangeRates')}
                  {renderPermissionSwitch('الوحدات', 'units')}
                </div>
              </div>

              <Button className="w-full" onClick={() => toast.success('تم حفظ الصلاحيات')}>
                حفظ الصلاحيات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="sm:max-w-lg bg-background border shadow-xl">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{selectedUser.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                <Badge variant={selectedUser.role === 'ShopOwner' ? 'default' : 'secondary'} className="mt-2">
                  {selectedUser.role === 'ShopOwner' ? 'مالك المتجر' : 'موظف'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">الصلاحيات</h4>
                
                {/* Dashboard */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    لوحة التحكم
                  </h5>
                  {renderPermissionSwitch('الوصول للوحة التحكم', 'dashboard')}
                </div>

                <Separator />

                {/* Products */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    المنتجات
                  </h5>
                  {renderPermissionSwitch('عرض المنتجات', 'products', 'view')}
                  {renderPermissionSwitch('إضافة منتجات', 'products', 'add')}
                  {renderPermissionSwitch('تعديل المنتجات', 'products', 'edit')}
                  {renderPermissionSwitch('حذف المنتجات', 'products', 'delete')}
                </div>

                <Separator />

                {/* Sales */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    المبيعات
                  </h5>
                  {renderPermissionSwitch('عرض المبيعات', 'sales', 'view')}
                  {renderPermissionSwitch('إنشاء مبيعات', 'sales', 'create')}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  toast.success(`تم حفظ تغييرات ${selectedUser.name}`);
                  setEditUserDialog(false);
                }} className="flex-1">
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setEditUserDialog(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;

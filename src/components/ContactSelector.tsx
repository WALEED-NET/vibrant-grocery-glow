
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { usePhoneContacts } from '@/hooks/usePhoneContacts';
import { Users, Phone, Search, CheckCircle } from 'lucide-react';
import { Contact } from '@/types';

interface ContactSelectorProps {
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact | null) => void;
  manualPhone: string;
  onManualPhoneChange: (phone: string) => void;
}

const ContactSelector = ({ 
  selectedContact, 
  onContactSelect, 
  manualPhone, 
  onManualPhoneChange 
}: ContactSelectorProps) => {
  const { contacts, isSupported, isLoading, error, requestContacts } = usePhoneContacts();
  const [showContacts, setShowContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleContactSelect = (contact: Contact) => {
    onContactSelect(contact);
    onManualPhoneChange(contact.phone);
    setShowContacts(false);
  };

  const handleManualInput = () => {
    onContactSelect(null);
    setShowContacts(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="flex-1">
          <Label className="text-sm font-medium mb-2 block">رقم الواتس اب</Label>
          <Input
            placeholder="رقم الواتس اب (مع رمز البلد)"
            value={selectedContact ? selectedContact.phone : manualPhone}
            onChange={(e) => {
              onManualPhoneChange(e.target.value);
              if (selectedContact) onContactSelect(null);
            }}
            dir="ltr"
            className="text-left"
          />
        </div>
        
        {isSupported && (
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (contacts.length === 0) {
                  requestContacts();
                }
                setShowContacts(!showContacts);
              }}
              disabled={isLoading}
              className="flex items-center space-x-1 mt-6"
            >
              <Users className="h-4 w-4" />
              <span>{isLoading ? 'جاري التحميل...' : 'جهات الاتصال'}</span>
            </Button>
          </div>
        )}
      </div>

      {selectedContact && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            تم اختيار: {selectedContact.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualInput}
            className="mr-auto text-green-700 hover:text-green-900"
          >
            تغيير
          </Button>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {showContacts && (
        <Card className="border">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في جهات الاتصال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{contacts.length === 0 ? 'لا توجد جهات اتصال' : 'لا توجد نتائج'}</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 text-right">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground" dir="ltr">
                          {contact.phone}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-green-600" />
                        {contact.isWhatsAppActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactSelector;

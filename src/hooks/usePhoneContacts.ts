
import { useState, useEffect } from 'react';
import { Contact } from '@/types';

interface PhoneContactsHook {
  contacts: Contact[];
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
  requestContacts: () => Promise<void>;
}

export const usePhoneContacts = (): PhoneContactsHook => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if navigator.contacts is supported
  const isSupported = 'contacts' in navigator && 'ContactsManager' in window;

  const requestContacts = async () => {
    if (!isSupported) {
      setError('جهات الاتصال غير مدعومة في هذا المتصفح');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request contacts permission and access
      const contacts = await (navigator as any).contacts.select(['name', 'tel'], {
        multiple: true
      });

      const formattedContacts: Contact[] = contacts.map((contact: any, index: number) => ({
        id: `contact-${index}`,
        name: contact.name?.[0] || 'غير محدد',
        phone: contact.tel?.[0] || '',
        isWhatsAppActive: true // We'll assume WhatsApp is active for simplicity
      })).filter((contact: Contact) => contact.phone);

      setContacts(formattedContacts);
    } catch (err) {
      console.error('Error accessing contacts:', err);
      setError('فشل في الوصول إلى جهات الاتصال. يرجى التحقق من الأذونات.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contacts,
    isSupported,
    isLoading,
    error,
    requestContacts,
  };
};

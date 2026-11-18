import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';
import { useAuth } from './AuthContext';

const ContactsContext = createContext(null);

export const ContactsProvider = ({ children }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await contactService.getContacts(user?.id || 'demo-user');
      setContacts(list);
    } catch (e) {
      console.warn('Error loading contacts:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const saveContact = async (contactData) => {
    const saved = await contactService.saveContact(contactData, user?.id || 'demo-user');
    await loadContacts();
    return saved;
  };

  const deleteContact = async (contactId) => {
    const remaining = await contactService.deleteContact(contactId, user?.id || 'demo-user');
    setContacts(remaining);
  };

  const setPrimaryContact = async (contactId) => {
    const updated = await contactService.setPrimaryContact(contactId);
    setContacts(updated);
  };

  const primaryContact = contacts.find(c => c.isPrimary) || contacts[0] || null;

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        primaryContact,
        loading,
        saveContact,
        deleteContact,
        setPrimaryContact,
        reloadContacts: loadContacts
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) throw new Error('useContacts must be used within a ContactsProvider');
  return context;
};

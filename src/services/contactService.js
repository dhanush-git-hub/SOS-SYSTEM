import { storage } from './storage';
import { isFirebaseConfigured, db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const contactService = {
  // Get all contacts
  async getContacts(userId = 'demo-user') {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, `users/${userId}/contacts`));
        const contacts = [];
        querySnapshot.forEach((docSnap) => {
          contacts.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (contacts.length > 0) return contacts.sort((a, b) => a.priority - b.priority);
      } catch (err) {
        console.warn('Firebase getContacts failed, falling back to LocalStorage:', err);
      }
    }
    return storage.getContacts().sort((a, b) => a.priority - b.priority);
  },

  // Save or update contact
  async saveContact(contact, userId = 'demo-user') {
    const contacts = storage.getContacts();
    
    // If setting as primary, demote any other primary
    if (contact.isPrimary) {
      contacts.forEach(c => {
        if (c.id !== contact.id) c.isPrimary = false;
      });
    }

    if (contact.id) {
      const idx = contacts.findIndex(c => c.id === contact.id);
      if (idx >= 0) {
        contacts[idx] = { ...contacts[idx], ...contact };
      } else {
        contacts.push(contact);
      }
    } else {
      contact.id = 'contact-' + Date.now();
      contacts.push(contact);
    }

    storage.saveContacts(contacts);

    if (isFirebaseConfigured && db) {
      try {
        if (contact.id.startsWith('contact-')) {
          await addDoc(collection(db, `users/${userId}/contacts`), contact);
        } else {
          await updateDoc(doc(db, `users/${userId}/contacts`, contact.id), contact);
        }
      } catch (err) {
        console.warn('Firebase saveContact failed:', err);
      }
    }

    return contact;
  },

  // Delete contact
  async deleteContact(contactId, userId = 'demo-user') {
    const contacts = storage.getContacts().filter(c => c.id !== contactId);
    // If deleted contact was primary, make the first one primary
    if (contacts.length > 0 && !contacts.some(c => c.isPrimary)) {
      contacts[0].isPrimary = true;
    }
    storage.saveContacts(contacts);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, `users/${userId}/contacts`, contactId));
      } catch (err) {
        console.warn('Firebase deleteContact failed:', err);
      }
    }

    return contacts;
  },

  // Set primary contact
  async setPrimaryContact(contactId) {
    const contacts = storage.getContacts();
    contacts.forEach(c => {
      c.isPrimary = (c.id === contactId);
    });
    storage.saveContacts(contacts);
    return contacts;
  },

  // Generate direct call link
  getCallUrl(phone) {
    if (!phone) return '#';
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    return `tel:${cleanNumber}`;
  },

  // Generate SMS link with emergency SOS template
  getSmsUrl(phone, userName, mapsUrl) {
    if (!phone) return '#';
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(
      `[SAFEZONE EMERGENCY ALERT] ${userName || 'User'} has triggered an SOS! Live GPS location: ${mapsUrl || 'Location sharing active'}. Please check immediately!`
    );
    return `sms:${cleanNumber}?body=${message}`;
  }
};

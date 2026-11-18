import React, { useState } from 'react';
import { useContacts } from '../context/ContactsContext';
import { 
  Users, 
  Plus, 
  Star, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';

export const TrustedContactsPage = () => {
  const { 
    contacts, 
    saveContact, 
    deleteContact, 
    setPrimaryContact, 
    loading 
  } = useContacts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState(1);
  const [isPrimary, setIsPrimary] = useState(false);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('Family');
    setEmail('');
    setPriority(contacts.length + 1);
    setIsPrimary(contacts.length === 0);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setName(contact.name || '');
    setPhone(contact.phone || '');
    setRelationship(contact.relationship || 'Family');
    setEmail(contact.email || '');
    setPriority(contact.priority || 1);
    setIsPrimary(Boolean(contact.isPrimary));
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError('Please enter both name and a valid phone number.');
      return;
    }

    const contactData = {
      id: editingContact ? editingContact.id : undefined,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      email: email.trim(),
      priority: parseInt(priority, 10) || 1,
      isPrimary
    };

    await saveContact(contactData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, contactName) => {
    if (window.confirm(`Are you sure you want to remove ${contactName} from your trusted emergency contacts?`)) {
      await deleteContact(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-red-600" />
            Trusted Emergency Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            People and dispatch hotlines alerted automatically whenever you trigger an SOS.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Primary Hotline Advice Box */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/30 text-red-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-sm text-white">Emergency Dispatch Hierarchy</div>
            <p className="text-slate-300 mt-0.5">
              The primary contact receives highest priority alert dispatch and direct automated telecommunication forwarding.
            </p>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading trusted contacts...
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Contacts Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Add at least one trusted friend, family member, or campus security officer to ensure someone is notified during an emergency.
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs"
          >
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                contact.isPrimary 
                  ? 'border-red-400 ring-2 ring-red-100' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Priority #{contact.priority || 1}
                  </span>

                  {contact.isPrimary ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full uppercase">
                      <Star className="w-3 h-3 fill-red-600 text-red-600" />
                      Primary Contact
                    </span>
                  ) : (
                    <button
                      onClick={() => setPrimaryContact(contact.id)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors"
                      title="Set as Primary Contact"
                    >
                      Make Primary
                    </button>
                  )}
                </div>

                {/* Name & details */}
                <h3 className="font-bold text-base text-slate-900">{contact.name}</h3>
                <div className="text-xs text-slate-500 font-medium mb-3">{contact.relationship}</div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <a
                  href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingContact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins (Mother)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 382-9901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Spouse / Partner">Spouse / Partner</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend / Roommate">Friend / Roommate</option>
                    <option value="Campus Security">Campus Security</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@family.net"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="primaryCheckbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor="primaryCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Set as Primary Emergency Contact
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

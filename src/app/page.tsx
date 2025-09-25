"use client";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { email } from "zod";
import { id } from "zod/locales";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Contact{
  id?: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export default function Home() {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({name: "", email: "", phone: ""});
  const [error, setError] = useState<String | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  function validateForm(data: typeof formData){
    return data.name.trim() !== '' && /\S+@\S+\.\S+/.test(data.email);
  }

  function startEdit(contact: Contact){
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
    });
    setIsFormValid(validateForm({ name: contact.name, email: contact.email, phone: contact.phone || "" }));
  }
  async function handleDelete(id? :string) {
    if(!id) return;
    try{
      setLoading(true);
      setError(null);
      const res = await fetch('/api/contacts', {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id})
      });
      if(!res.ok){
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete Contact");
      }
      toast.success("Contact deleted");
      await fetchContacts()
    }catch(error){
      const message = (error as Error).message;
      setError(message);
      toast.error(message);
    }finally{
      setLoading(false);
    }
  }

  async function fetchContacts() {
    try{
      setLoading(true);
      setError(null);
      const res = await fetch('/api/contacts');
      if(!res.ok){
        throw new Error("Failed to fetch contacts");
      } 
      const data = await res.json();

      //Transform: map each contact's _id with id
      const transformedContacts = data.contacts.map((contact: any) => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        createdAt: contact.createdAt,
      }));
      setContacts(transformedContacts);
      
    }catch(e){
      const message = (e as Error).message;
      setError(message);
      toast.error(message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    const newFormData = {...formData, [e.target.name]: e.target.value};
    setFormData(newFormData);
    setIsFormValid(validateForm(newFormData));
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!formData.name || !formData.email){
      setError("Name and email are required");
      return;
    }
    try{
      setLoading(true);
      setError(null);

      const url = '/api/contacts'
      const method = editingContact ? "PUT" : "POST";

      const body = editingContact ? {id: editingContact.id, ...formData} : formData;

      const res = await fetch(url, {
        method,
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
      });
      if(!res.ok){
        const errData = await res.json();
        throw new Error(errData.errors?.join(", ") || "Failed to add contact");
      }
      toast.success(editingContact ? "Contact updated" : "Contact added");
      setFormData({name: "", email: "", phone: ""});
      setIsFormValid(false);
      setEditingContact(null);
      await fetchContacts();
    }catch(e){
      const message = (e as Error).message;
      setError(message);
      toast.error(message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
        <Navbar />
        <Hero />
        <main>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <form id="contact-form" onSubmit={handleSubmit} noValidate className="mb-8 bg-blue-50 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-900" aria-live="polite">{editingContact ? "Edit Contact" : "Add Contact"}</h2>
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-3">
              <input 
              aria-label="Name"
              type="text" 
              name="name" 
              placeholder="Name *" 
              value={formData.name} 
              onChange={handleChange}
              required 
              disabled = {loading}
              className="flex-grow px-4 py-2 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-700"/>
              <input 
              aria-label="Email"
              type="email" 
              name="email" 
              placeholder="Email *" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled = {loading}
              className="flex-grow px-4 py-2 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-700"/>
              <input 
              aria-label="Phone Number"
              type="tel" 
              placeholder="Phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              disabled = {loading}
              className="flex-grow px-4 py-2 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-700"/>
              <button 
              type="submit" 
              disabled={loading || !isFormValid} 
              aria-label={editingContact ? "Save contact changes" : "Add new contact"}
              className="bg-blue-700 text-white rounded px-6 py-2 font-semibold shadow hover:bg-blue-900 transition disabled:opacity-60">
                {loading ? (editingContact ? "Saving..." : "Adding...") : (editingContact ? "Save" : "Add")}
              </button>

              {/* add cancel button only when editing */}
              {editingContact && (
                <button
                type="button"
                onClick={()=>{
                  setEditingContact(null);
                  setFormData({name: '', email: '', phone: ''});
                  setError(null);
                  setIsFormValid(false);
                }} aria-label="Cancel editing">Cancel</button>
              )}
            </div>
            {error && <p className="text-red-600 mt-2" role="alert" aria-live="assertive">{error}</p>}
          </form>

          <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Contacts</h2>
              {loading && !contacts.length ? (
                <p>Loading Contacts..</p>
              ) : contacts.length === 0 ? (
                <p>No contacts found.</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="border-l-4 border-blue-700 bg-blue-100 rounded-md mb-3 p-4 shadow">
                    <p className="font-semibold text-blue-900">{contact.name}</p>
                    <p>{contact.email}</p>
                    {contact.phone && <p>{contact.phone}</p>}
                    {contact.createdAt && (
                      <p className="italic text-sm text-gray-600">Added: {new Date(contact.createdAt).toLocaleString()}</p>
                    )}
                    <button onClick={() => startEdit(contact)} aria-label={`Edit ${contact.name} contact`} className="bg-blue-700 text-white rounded mr-1.5 mt-2 px-6 py-2 font-semibold shadow hover:bg-blue-900 transition disabled:opacity-60">Edit</button>
                    <button onClick={() => handleDelete(contact.id)} aria-label={`Delete ${contact.name} contact`} className="bg-black text-white rounded px-6 py-2 font-semibold shadow hover:bg-gray-800 transition disabled:opacity-60">Delete</button>
                  </div>
                ))
              )}
          </section>
        </main>
    </>
  );
}

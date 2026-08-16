import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Send, CheckCircle2, User
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: 'Imran Rauf Khan',
    phone: '8898133393',
    email: '',
    subject: 'Bulk Ladder Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: 'Imran Rauf Khan',
        phone: '8898133393',
        email: '',
        subject: 'Bulk Ladder Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-12 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-3 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Contact Akash Ladders Sales & Engineering</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
            Have questions about load specs, custom ladder dimensions, or corporate bulk pricing? Contact Sales Head <strong className="text-amber-600 dark:text-amber-400">Imran Rauf Khan</strong> today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" /> Send Us an Inquiry Message
          </h2>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. Sales Head Imran Rauf Khan (+91 8898133393) will get back to you within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Contact Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Imran Rauf Khan"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="8898133393"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Inquiry Type
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bulk Ladder Inquiry">Bulk Ladder Inquiry</option>
                    <option value="Customized Ladder Order">Customized Ladder Order</option>
                    <option value="Dealer & Distribution">Dealer & Distribution</option>
                    <option value="Safety Specs & Certification">Safety Specs & Certification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Message Details
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mention ladder model, required height, load rating, or site location..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>

            </form>
          )}
        </div>

        {/* Right Column: Contact Details & Office Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" /> Direct Sales Office
            </h2>

            <div className="space-y-4 text-xs">
              
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <User className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white text-sm">Imran Rauf Khan</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Head of Sales & Technical Procurement</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Phone & Mobile:</span>
                  <a href="tel:8898133393" className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-sm">
                    +91 8898133393
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">WhatsApp Hotline:</span>
                  <a 
                    href="https://wa.me/918898133393?text=Hello%20Imran%20Khan,%20I%20have%20an%20inquiry%20regarding%20Akash%20Ladders." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                  >
                    +91 8898133393 (Click to Chat)
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Email Addresses:</span>
                  <a href="mailto:info@akashladders.com" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white block">
                    info@akashladders.com
                  </a>
                  <a href="mailto:sales@akashladders.com" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white block">
                    sales@akashladders.com
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Factory & Head Office Address:</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Akash Ladder Works, Plot 42, Marol Industrial Estate, MIDC, Andheri East, Mumbai, Maharashtra 400093
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Working Hours:</span>
                  <span className="text-slate-600 dark:text-slate-300">Monday - Saturday: 9:00 AM - 7:00 PM</span>
                  <span className="block text-slate-400 dark:text-slate-500 text-[10px]">Sunday Closed (WhatsApp active)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Map Embed / Location Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" /> Factory Location & Dispatch Center
        </h2>
        <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative flex items-center justify-center text-center p-6">
          <iframe
            title="Akash Ladders Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.754382894541!2d72.87325631490217!3d19.118485987063463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m3!1s0x3be7c83c21a48ff3%3A0xb35a09bc3ddc8261!2sMarol%20MIDC%20Industry!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            className="w-full h-full border-0 filter opacity-80 dark:grayscale dark:contrast-125"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default Contact;

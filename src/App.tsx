import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  User, 
  MessageCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Filter,
  ChevronRight,
  X,
  Camera,
  Loader2,
  MapPin,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, Seller, University, Category } from './types';
import { UNIVERSITIES, CATEGORIES } from './constants';

// --- Components ---

const Navbar = ({ 
  onSearch, 
  onAddListing, 
  onProfileClick,
  userSeller
}: { 
  onSearch: (val: string) => void, 
  onAddListing: () => void,
  onProfileClick: () => void,
  userSeller: Seller | null
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <h1 className="hidden sm:block text-xl font-display text-zinc-900">CampusMarket</h1>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products or services..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onAddListing}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Sell</span>
          </button>
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors"
          >
            {userSeller ? (
              <img src={userSeller.business_logo} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

const ListingCard = ({ listing, onReport }: { listing: Listing, onReport: (id: number) => any, key?: any }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img 
          src={listing.photos[0] || `https://picsum.photos/seed/${listing.id}/400/300`} 
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.university}
          </span>
        </div>
        <button 
          onClick={() => onReport(listing.id)}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-zinc-400 hover:text-red-500 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-primary flex items-center gap-1">
            <Tag className="w-3 h-3" /> {listing.category}
          </span>
          <span className="text-lg font-bold text-zinc-900">MK {listing.price.toLocaleString()}</span>
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-2 line-clamp-1">{listing.name}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 h-10">{listing.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src={listing.business_logo} 
                alt={listing.business_name} 
                className="w-8 h-8 rounded-full object-cover border border-zinc-200"
              />
              {listing.is_verified && (
                <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-500 fill-blue-50" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-zinc-700">{listing.business_name}</span>
          </div>
          
          <a 
            href={`https://wa.me/${listing.whatsapp_number}?text=Hi, I'm interested in your ${listing.name} on CampusMarket.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const FilterSection = ({ 
  selectedUniv, 
  setSelectedUniv, 
  selectedCat, 
  setSelectedCat 
}: { 
  selectedUniv: string, 
  setSelectedUniv: (v: string) => void,
  selectedCat: string,
  setSelectedCat: (v: string) => void
}) => {
  return (
    <div className="py-6 space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <MapPin className="w-3 h-3" /> Universities
        </h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedUniv("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedUniv === "" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
          >
            All Campus
          </button>
          {UNIVERSITIES.map(u => (
            <button 
              key={u}
              onClick={() => setSelectedUniv(u)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedUniv === u ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <Tag className="w-3 h-3" /> Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCat("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCat === "" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
          >
            All Categories
          </button>
          {CATEGORIES.map(c => (
            <button 
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCat === c ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUniv, setSelectedUniv] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userSeller, setUserSeller] = useState<Seller | null>(null);

  // Form states
  const [newListing, setNewListing] = useState({
    name: "",
    price: "",
    description: "",
    category: CATEGORIES[0] as Category,
    university: UNIVERSITIES[0] as University,
    photos: [""],
    whatsapp_number: ""
  });

  const [newSeller, setNewSeller] = useState({
    email_phone: "",
    business_name: "",
    business_logo: "",
    university: UNIVERSITIES[0] as University,
    bio: ""
  });

  useEffect(() => {
    // Load local seller profile if exists
    const savedSeller = localStorage.getItem('campus_market_seller');
    if (savedSeller) {
      setUserSeller(JSON.parse(savedSeller));
    }
    fetchListings();
  }, [selectedUniv, selectedCat, search]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUniv) params.append("university", selectedUniv);
      if (selectedCat) params.append("category", selectedCat);
      if (search) params.append("search", search);
      
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeller)
      });
      const data = await res.json();
      const seller = { ...newSeller, id: data.id, is_verified: false, created_at: new Date().toISOString() } as Seller;
      setUserSeller(seller);
      localStorage.setItem('campus_market_seller', JSON.stringify(seller));
    } catch (err) {
      alert("Failed to create profile");
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSeller) return;

    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newListing,
          seller_id: userSeller.id,
          price: parseFloat(newListing.price),
          photos: newListing.photos.filter(p => p.trim() !== "")
        })
      });
      setShowAddModal(false);
      fetchListings();
      setNewListing({
        name: "",
        price: "",
        description: "",
        category: CATEGORIES[0] as Category,
        university: UNIVERSITIES[0] as University,
        photos: [""],
        whatsapp_number: ""
      });
    } catch (err) {
      alert("Failed to create listing");
    }
  };

  const handleReport = async (listingId: number) => {
    const reason = prompt("Why are you reporting this listing?");
    if (!reason) return;

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, reason })
      });
      alert("Report submitted. Thank you for keeping our community safe.");
    } catch (err) {
      alert("Failed to submit report");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        onSearch={setSearch} 
        onAddListing={() => setShowAddModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
        userSeller={userSeller}
      />

      <main className="max-w-7xl mx-auto px-4">
        <FilterSection 
          selectedUniv={selectedUniv} 
          setSelectedUniv={setSelectedUniv}
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-zinc-500 font-medium">Loading marketplace...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onReport={handleReport} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No listings found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>

      {/* --- Modals --- */}

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl">Create Listing</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!userSeller ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Seller Profile Required</h3>
                  <p className="text-zinc-500 mb-6">You need to create a business profile before you can post listings.</p>
                  <button 
                    onClick={() => { setShowAddModal(false); setShowProfileModal(true); }}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                  >
                    Create Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateListing} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newListing.name}
                      onChange={e => setNewListing({...newListing, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Price (MK)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={newListing.price}
                        onChange={e => setNewListing({...newListing, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">WhatsApp Number</label>
                      <input 
                        required
                        type="text" 
                        placeholder="265..."
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={newListing.whatsapp_number}
                        onChange={e => setNewListing({...newListing, whatsapp_number: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Category</label>
                      <select 
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={newListing.category}
                        onChange={e => setNewListing({...newListing, category: e.target.value as Category})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">University</label>
                      <select 
                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={newListing.university}
                        onChange={e => setNewListing({...newListing, university: e.target.value as University})}
                      >
                        {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description</label>
                    <textarea 
                      required
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                      value={newListing.description}
                      onChange={e => setNewListing({...newListing, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Photo URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        placeholder="https://..."
                        className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={newListing.photos[0]}
                        onChange={e => setNewListing({...newListing, photos: [e.target.value]})}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors mt-4"
                  >
                    Post Listing
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {showProfileModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl">{userSeller ? "My Profile" : "Create Seller Profile"}</h2>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {userSeller ? (
                <div className="p-8 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img src={userSeller.business_logo} alt="Logo" className="w-full h-full rounded-full object-cover border-4 border-zinc-50 shadow-sm" />
                    {userSeller.is_verified && (
                      <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-1 shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-display mb-1">{userSeller.business_name}</h3>
                  <p className="text-zinc-500 text-sm mb-4 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" /> {userSeller.university}
                  </p>
                  <div className="bg-zinc-50 rounded-2xl p-4 text-left mb-6">
                    <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Contact Info</p>
                    <p className="text-zinc-700 font-medium">{userSeller.email_phone}</p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('campus_market_seller');
                      setUserSeller(null);
                    }}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Logout / Delete Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateSeller} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Business Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newSeller.business_name}
                      onChange={e => setNewSeller({...newSeller, business_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Email or Phone</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newSeller.email_phone}
                      onChange={e => setNewSeller({...newSeller, email_phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">University</label>
                    <select 
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newSeller.university}
                      onChange={e => setNewSeller({...newSeller, university: e.target.value as University})}
                    >
                      {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Logo URL</label>
                    <input 
                      required
                      type="url" 
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newSeller.business_logo}
                      onChange={e => setNewSeller({...newSeller, business_logo: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors mt-4"
                  >
                    Create Profile
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

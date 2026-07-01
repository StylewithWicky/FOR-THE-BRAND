import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingBag, Trash2, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import axiosClient from '../api/axiosClients';

interface MerchItem {
  id: number;
  item_name: string;
  sku: string;
  quantity: number;
  price: number;
  status: 'IN_STOCK' | 'DEPLOYED' | 'MAINTENANCE';
  image_url?: string; // 🖼️ Added image property
}

const merchService = {
  getAll: () => axiosClient.get('/merch/'),
  createItem: (data: Partial<MerchItem>) => axiosClient.post('/merch/', data),
  deleteItem: (id: number) => axiosClient.delete(`/merch/${id}`)
};

export default function Merch() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State for creating new item
  const [newItem, setNewItem] = useState({
    item_name: '',
    sku: '',
    quantity: 0,
    price: 0,
    status: 'IN_STOCK' as const,
    image_url: '' // 🖼️ Form field state
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await merchService.getAll();
      setItems(res.data);
    } catch (err) {
      console.error("Sync Failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Remove this asset from registry?")) {
      try {
        await merchService.deleteItem(id);
        fetchInventory();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cleans up empty image URLs before sending to the backend
      const payload = {
        ...newItem,
        image_url: newItem.image_url.trim() || undefined
      };
      await merchService.createItem(payload);
      setIsAdding(false);
      setNewItem({ item_name: '', sku: '', quantity: 0, price: 0, status: 'IN_STOCK', image_url: '' });
      fetchInventory();
    } catch (err) {
      console.error("Failed to create item", err);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-10 font-sans">
      
      {/* Navigation */}
      <button 
        onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors uppercase text-[10px] font-bold tracking-widest mb-8 sm:mb-12"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 sm:mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Merch Shop</h2>
            <p className="text-slate-500 mt-1 sm:mt-2 font-medium text-sm sm:text-base">Manage your inventory and brand assets.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 w-full sm:w-auto self-start sm:self-auto"
          >
            <Plus size={16} /> Register New Item
          </button>
        </header>

        {/* Dynamic Inline Entry Form Block */}
        {isAdding && (
          <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 mb-10 transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Add New Merch Asset</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Item Name</label>
                <input 
                  type="text" required
                  value={newItem.item_name}
                  onChange={e => setNewItem({...newItem, item_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">SKU identifier</label>
                <input 
                  type="text" required
                  value={newItem.sku}
                  onChange={e => setNewItem({...newItem, sku: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Price (KES)</label>
                <input 
                  type="number" required min="0"
                  value={newItem.price || ''}
                  onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quantity</label>
                <input 
                  type="number" required min="0"
                  value={newItem.quantity || ''}
                  onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              {/* 🖼️ Image URL Input Field */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Image URL (Optional)</label>
                <input 
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newItem.image_url}
                  onChange={e => setNewItem({...newItem, image_url: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2 md:col-span-5 flex justify-end gap-3 mt-4">
                <button 
                  type="button" onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
                No inventory assets matching records found.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
                  
                  {/* Card Media Header Container */}
                  <div className="relative bg-slate-100 h-48 w-full flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback fallback mechanism if image fails to load or link dies
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}

                    {/* Fallback Icon Wrapper (renders if no url exists or link breaks) */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-600 ${item.image_url ? 'hidden' : ''}`}>
                      <ShoppingBag size={40} className="stroke-[1.5]" />
                    </div>

                    {/* Floating Delete Badge Trigger */}
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-slate-500 hover:text-red-500 p-2 rounded-full shadow-sm transition-colors z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Info Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                      <h4 className="text-lg font-bold mt-1 mb-4 text-slate-800 line-clamp-2">{item.item_name}</h4>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                          <p className="font-bold text-blue-600">KES {item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Stock</p>
                          <p className="text-2xl font-extrabold text-slate-800">{item.quantity}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50/60 flex justify-between items-center">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          item.status === 'IN_STOCK' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <button className="text-[10px] font-bold uppercase flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <RefreshCw size={12} /> Restock
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
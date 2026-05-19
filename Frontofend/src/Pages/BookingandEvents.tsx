import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, User, Truck, DollarSign, ShieldAlert, Plus, CheckCircle, Trash2 } from 'lucide-react';
import axiosClient from '../api/axiosClients';

interface TripLogistics {
  transport_means: string;
  driver_name: string | null;
  assignment_date: string | null;
  driver_charge: number;
  vehicle_sku: string | null;
}

interface AdminEvent {
  id: number;
  title: string;
  venue_place: string;
  event_date: string;
  hotel_name: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  package_details: string | null;
  hotel_cost: number;
  is_archived: boolean;
  trip_details: TripLogistics | null;
}

export default function BookingsAndEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    venue_place: '',
    event_date: '',
    hotel_name: '',
    contact_person: '',
    contact_phone: '',
    package_details: '',
    hotel_cost: 0,
    transport_means: '',
    driver_name: '',
    assignment_date: '',
    driver_charge: 0,
    vehicle_sku: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosClient.get('/api/v1/admin/all');
      setEvents(response.data);
    } catch (err) {
      console.error("Error retrieving admin events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name.includes('charge') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/api/v1/', formData);
      setShowModal(false);
      fetchEvents();
      setFormData({
        title: '', venue_place: '', event_date: '', hotel_name: '',
        contact_person: '', contact_phone: '', package_details: '', hotel_cost: 0,
        transport_means: '', driver_name: '', assignment_date: '', driver_charge: 0, vehicle_sku: ''
      });
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axiosClient.delete(`/api/v1/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Delete operation failed:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Bookings & Events Hub</h1>
          <p style={{ color: '#aaa', margin: '4px 0 0 0' }}>Manage unified event schedules and internal fleet logistics</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <Plus size={20} /> Create New Operation
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {events.map(event => {
          const totalCost = event.hotel_cost + (event.trip_details?.driver_charge || 0);
          return (
            <div key={event.id} style={{ backgroundColor: '#222', borderRadius: '12px', border: '1fr solid #333', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1fr solid #333', display: 'flex', justifyContent: 'between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0070f3' }}>{event.title}</h2>
                  <div style={{ display: 'flex', gap: '16px', color: '#aaa', fontSize: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {new Date(event.event_date).toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {event.venue_place}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(event.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: '#333' }}>
                <div style={{ backgroundColor: '#1e1e1e', padding: '20px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#888', marginTop: 0, marginBottom: '12px', letterSpacing: '1px' }}>Hospitality & Package</h3>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Hotel:</strong> {event.hotel_name || 'N/A'}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Contact:</strong> {event.contact_person || 'N/A'} ({event.contact_phone || 'N/A'})</p>
                  <p style={{ margin: '0 0 12px 0', color: '#ccc', fontSize: '14px' }}>{event.package_details || 'No package description details provided.'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#00ff66', fontWeight: 'bold' }}>
                    <DollarSign size={16} /> Venue Cost: KES {event.hotel_cost.toLocaleString()}
                  </div>
                </div>

                <div style={{ backgroundColor: '#1a2333', padding: '20px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#38bdf8', marginTop: 0, marginBottom: '12px', letterSpacing: '1px' }}>Internal Logistics (Hidden from Client)</h3>
                  {event.trip_details ? (
                    <>
                      <p style={{ margin: '0 0 8px 0' }}><strong>Transit Mode:</strong> {event.trip_details.transport_means}</p>
                      <p style={{ margin: '0 0 8px 0' }}><strong>Driver Assigned:</strong> {event.trip_details.driver_name || 'Unassigned'}</p>
                      <p style={{ margin: '0 0 8px 0' }}><strong>Fleet Unit SKU:</strong> <code style={{ backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' }}>{event.trip_details.vehicle_sku || 'N/A'}</code></p>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#38bdf8', fontWeight: 'bold' }}>
                        <DollarSign size={16} /> Driver Pay: KES {event.trip_details.driver_charge.toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>No logistics attached to this operation.</p>
                  )}
                </div>
              </div>

              <div style={{ padding: '12px 20px', backgroundColor: '#151515', display: 'flex', justifyContent: 'between', fontSize: '14px' }}>
                <span style={{ color: '#aaa' }}>Operation ID: {event.id}</span>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>Total Running Cost: KES {totalCost.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#222', borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1fr solid #333' }}>
            <div style={{ padding: '20px', borderBottom: '1fr solid #333', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '22px' }}>Initialize Management Operation</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px' }}>
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0070f3', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Hospitality & Event Specs</h3>
                
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Operation Title</span>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Venue Place</span>
                    <input type="text" name="venue_place" required value={formData.venue_place} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                  </label>
                  <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Event Date & Time</span>
                    <input type="datetime-local" name="event_date" required value={formData.event_date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                  </label>
                </div>

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Hotel Name</span>
                  <input type="text" name="hotel_name" value={formData.hotel_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Contact Person</span>
                    <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                  </label>
                  <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Contact Phone</span>
                    <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                  </label>
                </div>

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Package Details</span>
                  <textarea name="package_details" value={formData.package_details} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff', resize: 'none' }} />
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Hotel Cost (KES)</span>
                  <input type="number" name="hotel_cost" value={formData.hotel_cost} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>
              </div>

              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={18} /> Internal Operational Logistics</h3>
                
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Means of Transport</span>
                  <input type="text" name="transport_means" required placeholder="e.g. Mercedes V-Class, Helicopter" value={formData.transport_means} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Driver Name</span>
                  <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Assignment Date</span>
                  <input type="datetime-local" name="assignment_date" value={formData.assignment_date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Vehicle Fleet SKU / Plates</span>
                  <input type="text" name="vehicle_sku" placeholder="e.g. KDL 001A" value={formData.vehicle_sku} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#aaa' }}>Driver Charge (KES)</span>
                  <input type="number" name="driver_charge" value={formData.driver_charge} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1fr solid #444', backgroundColor: '#333', color: '#fff' }} />
                </label>
              </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1fr solid #333', display: 'flex', justifyContent: 'end', gap: '12px', backgroundColor: '#151515' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', color: '#fff', border: '1fr solid #444', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                {loading ? 'Processing...' : 'Save & Deploy'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
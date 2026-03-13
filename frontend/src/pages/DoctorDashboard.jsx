import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Stethoscope, ChevronRight, CheckCircle, FileText, Trash2, Clock, User, Search, Download } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DoctorDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [activeToken, setActiveToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], notes: ''
  });

  const fetchQueue = async () => {
    try {
      const res = await axios.get('/tokens');
      const activeTokens = res.data.data.filter(t => t.status !== 'Completed');
      setTokens(activeTokens);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleConsult = async (token) => {
    try {
      if (activeToken) return;
      setActiveToken(token);
      await axios.put(`/tokens/${token._id}/status`, { status: 'In-progress' });
      fetchQueue();
    } catch (e) {
      console.error(e);
      alert('Error updating token status');
    }
  };

  const handleAddMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMeds = [...prescriptionForm.medicines];
    updatedMeds[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMeds });
  };

  const removeMedicine = (index) => {
    if (prescriptionForm.medicines.length === 1) return;
    const updatedMeds = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMeds });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/prescriptions', {
        patientId: activeToken.patientId._id,
        tokenId: activeToken._id,
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        notes: prescriptionForm.notes
      });
      alert('Prescription saved!');
      generatePrescriptionPDF(res.data.data);
      setActiveToken(null);
      setPrescriptionForm({ diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], notes: '' });
      fetchQueue();
    } catch (e) {
      alert('Error saving prescription: ' + (e.response?.data?.error || e.message));
    }
    setIsLoading(false);
  };

  const generatePrescriptionPDF = (data) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235);
      doc.text('ClinicCare Hub', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Digital Prescription System', 105, 27, { align: 'center' });
      
      doc.setDrawColor(200);
      doc.line(20, 35, 190, 35);
      
      // Doctor Detail
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Dr. John Doe', 20, 45);
      doc.setFontSize(10);
      doc.text('Senior Consultant', 20, 50);
      
      // Patient Data
      doc.text('Patient: ' + (activeToken.patientId?.name || 'N/A'), 140, 45);
      doc.text('Age/Sex: ' + (activeToken.patientId?.age || '') + ' / ' + (activeToken.patientId?.gender || ''), 140, 50);
      doc.text('Date: ' + new Date().toLocaleDateString(), 140, 55);
      
      doc.line(20, 60, 190, 60);
      
      // Diagnosis
      doc.setFontSize(12);
      doc.text('DIAGNOSIS:', 20, 70);
      doc.setFontSize(11);
      doc.text(String(data.diagnosis || ''), 55, 70);
      
      // Medicines
      autoTable(doc, {
        startY: 80,
        head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
        body: data.medicines.map(m => [String(m.name), String(m.dosage), String(m.frequency), String(m.duration)]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }
      });
      
      // Notes
      const notesY = (doc.lastAutoTable?.finalY || 120) + 15;
      doc.setFontSize(12);
      doc.text('ADVICE / NOTES:', 20, notesY);
      doc.setFontSize(10);
      doc.text(String(data.notes || 'None'), 20, notesY + 7);
      
      // Manual blob download
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Prescription_' + (activeToken.patientId?.name || 'Patient') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Prescription Error:', err);
      alert('Error generating prescription PDF: ' + err.message);
    }
  };

  const filteredTokens = tokens.filter(t => 
    t.patientId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tokenNumber.toString().includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Token Queue Viewer */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Clock size={18} /></div>
                <h2 className="text-lg font-bold text-gray-800">Waiting Queue</h2>
              </div>
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tokens.length}</span>
            </div>

            {/* Search Queue */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Find patient..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 ring-blue-500"
              />
            </div>

            <div className="space-y-3 max-h-[300px] lg:max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">No matching patients</p>
                </div>
              ) : (
                filteredTokens.map(token => (
                  <div 
                    key={token._id} 
                    className={`group border rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between ${
                      activeToken?._id === token._id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' 
                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    } ${activeToken && activeToken._id !== token._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleConsult(token)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-full font-bold shadow-sm ${
                        token.status === 'In-progress' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-100'
                      }`}>
                        {token.tokenNumber}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{token.patientId?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-gray-500 truncate">{token.patientId?.symptoms || 'General Checkup'}</p>
                      </div>
                    </div>
                    
                    {token.status === 'In-progress' ? (
                      <Activity size={16} className="text-blue-600 animate-pulse shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-400" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Consultation Area */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {!activeToken ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Stethoscope size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Consultation</h3>
              <p className="text-gray-500 max-w-sm">Select a patient to begin digital prescription generation.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
              {/* Patient Header */}
              <div className="bg-blue-600 p-4 sm:p-5 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-black">
                    #{activeToken.tokenNumber}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold truncate">{activeToken.patientId?.name}</h2>
                    <p className="text-[11px] opacity-80 uppercase font-bold tracking-tighter">In Progress Consultation</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveToken(null)}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Consultation Form */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-280px)]">
                <form onSubmit={submitPrescription} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">Diagnosis</label>
                    <input 
                      required type="text" 
                      value={prescriptionForm.diagnosis} 
                      onChange={e => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-1 outline-none transition-all text-sm" 
                      style={{'--tw-ring-color': '#2563EB'}}
                      placeholder="e.g. Viral Fever" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Medicines</label>
                      <button type="button" onClick={handleAddMedicine} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors border border-blue-100">
                        + Add Drug
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {prescriptionForm.medicines.map((med, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 relative">
                          <input required placeholder="Drug" value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)} className="flex-1 p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-400"/>
                          <input required placeholder="Dosage" value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)} className="w-full sm:w-20 p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-400"/>
                          <input required placeholder="Freq" value={med.frequency} onChange={e => handleMedicineChange(index, 'frequency', e.target.value)} className="w-full sm:w-20 p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-400"/>
                          <input required placeholder="Dur" value={med.duration} onChange={e => handleMedicineChange(index, 'duration', e.target.value)} className="w-full sm:w-20 p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-400"/>
                          
                          {prescriptionForm.medicines.length > 1 && (
                            <button type="button" onClick={() => removeMedicine(index)} className="absolute -right-1.5 -top-1.5 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-widest">Advice / Notes</label>
                    <textarea 
                      value={prescriptionForm.notes} 
                      onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-1 outline-none h-24 text-sm" 
                      style={{'--tw-ring-color': '#2563EB'}}
                      placeholder="Bed rest..." 
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                      {isLoading ? 'Saving...' : <><Download size={18}/> Save & Download Prescription</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

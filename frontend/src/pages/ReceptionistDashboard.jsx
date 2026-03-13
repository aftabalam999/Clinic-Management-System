import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileSpreadsheet, UserPlus, Activity, Search, Printer, Download } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [patients, setPatients] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '', age: '', gender: 'Male', phone: '', address: '', symptoms: ''
  });
  
  const [billForm, setBillForm] = useState({
    patientId: '', consultationFee: 300, medicineCost: 0
  });

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/patients');
      setPatients(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTokens = async () => {
    try {
      const res = await axios.get('/tokens');
      setTokens(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'queue' || activeTab === 'billing' || activeTab === 'register') {
      fetchPatients();
    }
    if (activeTab === 'queue') {
      fetchTokens();
    }
  }, [activeTab]);

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/patients', patientForm);
      await axios.post('/tokens', { patientId: res.data.data._id });
      setPatientForm({ name: '', age: '', gender: 'Male', phone: '', address: '', symptoms: '' });
      setActiveTab('queue');
    } catch (e) {
      alert('Error registering patient: ' + (e.response?.data?.error || e.message));
    }
    setIsLoading(false);
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/billing', billForm);
      alert('Bill generated successfully!');
      generatePDFBill(res.data.data);
      setBillForm({ patientId: '', consultationFee: 300, medicineCost: 0 });
    } catch (e) {
      alert('Error generating bill: ' + (e.response?.data?.error || e.message));
    }
    setIsLoading(false);
  };

  const generatePDFBill = (billData) => {
    try {
      const doc = new jsPDF();
      const patient = patients.find(p => p._id === billData.patientId);
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235);
      doc.text('ClinicCare Hub', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text('123 Health Street, Medical City', 105, 27, { align: 'center' });
      doc.text('Phone: +91 9876543210', 105, 33, { align: 'center' });
      
      doc.setDrawColor(200);
      doc.line(20, 40, 190, 40);
      
      // Bill Title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('INVOICE / RECEIPT', 20, 50);
      
      // Details
      doc.setFontSize(10);
      doc.text('Bill Date: ' + new Date().toLocaleDateString(), 140, 50);
      doc.text('Patient Name: ' + (patient?.name || 'N/A'), 20, 60);
      doc.text('Contact: ' + (patient?.phone || 'N/A'), 20, 66);
      
      // Table
      autoTable(doc, {
        startY: 75,
        head: [['Description', 'Amount (INR)']],
        body: [
          ['Consultation Fee', 'INR ' + String(billData.consultationFee)],
          ['Medicine Charges', 'INR ' + String(billData.medicineCost)],
        ],
        foot: [['Total Amount', 'INR ' + String(billData.totalAmount)]],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        footStyles: { fillColor: [37, 99, 235], fontStyle: 'bold' }
      });
      
      // Footer
      const tableEndY = (doc.lastAutoTable?.finalY || 130) + 20;
      doc.text('Thank you for choosing ClinicCare Hub!', 105, tableEndY, { align: 'center' });
      
      // Manual blob download
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Bill_' + (patient?.name || 'Patient') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Bill Error:', err);
      alert('Error generating bill PDF: ' + err.message);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 shrink-0 h-fit flex md:flex-col gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex items-center justify-center md:justify-start space-x-3 w-full min-w-[150px] p-3 rounded-lg transition-colors ${activeTab === 'register' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <UserPlus size={20} />
              <span className="whitespace-nowrap">Register Patient</span>
            </button>
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex items-center justify-center md:justify-start space-x-3 w-full min-w-[150px] p-3 rounded-lg transition-colors ${activeTab === 'queue' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={20} />
              <span className="whitespace-nowrap">Token Queue</span>
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex items-center justify-center md:justify-start space-x-3 w-full min-w-[150px] p-3 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FileSpreadsheet size={20} />
              <span className="whitespace-nowrap">Billing</span>
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-[500px]">
          
          {activeTab === 'register' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><UserPlus size={24} /></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">New Patient Registration</h2>
              </div>
              
              <form onSubmit={handlePatientSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required type="text" value={patientForm.name} onChange={(e) => setPatientForm({...patientForm, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{'--tw-ring-color': '#2563EB'}} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input required type="number" value={patientForm.age} onChange={(e) => setPatientForm({...patientForm, age: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{'--tw-ring-color': '#2563EB'}} placeholder="30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none bg-white" style={{'--tw-ring-color': '#2563EB'}}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" value={patientForm.phone} onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{'--tw-ring-color': '#2563EB'}} placeholder="+91 9876543210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" value={patientForm.address} onChange={(e) => setPatientForm({...patientForm, address: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{'--tw-ring-color': '#2563EB'}} placeholder="123 Street Name" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
                    <textarea value={patientForm.symptoms} onChange={(e) => setPatientForm({...patientForm, symptoms: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none h-24" style={{'--tw-ring-color': '#2563EB'}} placeholder="Brief description of symptoms..."></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isLoading} className="w-full sm:w-auto hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2" style={{backgroundColor: '#2563EB'}}>
                    {isLoading ? 'Processing...' : 'Register & Generate Token'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Users size={24} /></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Live Token Queue</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={fetchTokens} className="flex-1 sm:flex-none text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    Refresh
                  </button>
                </div>
              </div>

              {tokens.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Activity className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>The queue is currently empty.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 -mx-4 sm:mx-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Token</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Info</th>
                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symptoms</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tokens.map((token) => (
                        <tr key={token._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm">
                              {token.tokenNumber}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{token.patientId?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 mt-1 sm:hidden">{token.patientId?.symptoms || '-'}</div>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                            {token.patientId?.symptoms || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              token.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 
                              token.status === 'In-progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {token.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-fade-in">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><FileSpreadsheet size={24} /></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Generate Bill</h2>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search patient..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#16A34A'}}
                  />
                </div>
              </div>

              <form onSubmit={handleBillSubmit} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                  <select 
                    required 
                    value={billForm.patientId} 
                    onChange={(e) => setBillForm({...billForm, patientId: e.target.value})} 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none bg-white"
                    style={{'--tw-ring-color': '#16A34A'}}
                  >
                    <option value="" disabled>-- Select a patient --</option>
                    {filteredPatients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label>
                    <input 
                      required 
                      type="number" 
                      value={billForm.consultationFee} 
                      onChange={(e) => setBillForm({...billForm, consultationFee: e.target.value})} 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
                      style={{'--tw-ring-color': '#16A34A'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Cost (₹)</label>
                    <input 
                      required 
                      type="number" 
                      value={billForm.medicineCost} 
                      onChange={(e) => setBillForm({...billForm, medicineCost: e.target.value})} 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
                      style={{'--tw-ring-color': '#16A34A'}}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total Amount:</span>
                    <span className="text-2xl" style={{color: '#2563EB'}}>₹ {Number(billForm.consultationFee || 0) + Number(billForm.medicineCost || 0)}</span>
                  </div>
                </div>

                <div className="flex pt-2">
                  <button type="submit" disabled={isLoading} className="w-full sm:w-auto hover:opacity-90 text-white font-medium py-3 px-8 rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-2" style={{backgroundColor: '#16A34A'}}>
                    {isLoading ? 'Processing...' : <><Printer size={20}/> Generate & Download Bill</>}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;

import { Mail, Phone, MapPin } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const faqs = [
  { q: 'How do I start receiving appointments?', a: 'Add your services from "My Services" and buy a subscription plan. Your services become visible to patients once your subscription is active.' },
  { q: 'How do I add a service boy?', a: 'Go to "My Subscriptions" and click "Add Service Boy" on an active plan with slots left. The service boy then logs in to the Service Boy app with the phone number and password you set.' },
  { q: 'How do I upload a report?', a: 'Open "Appointments", choose "Completed" or "Pending Reports", and click "Upload Report" on the appointment. PDF and Word files up to 5MB are supported.' },
  { q: 'How do withdrawals work?', a: 'Add a bank account under "Payment Method", then request a withdrawal from your "Wallet". Requests are reviewed and processed by the MahaDiagno team.' },
  { q: 'What does "Mark Cash Received" do?', a: 'When a service boy collects cash from a patient, the amount shows as "Money to be received". Mark it once the service boy has handed the cash over to you.' },
]

const Help = () => (
  <div>
    <PageHeader title="Help & Support" subtitle="Answers to common questions" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card p-6 lg:col-span-2 space-y-5">
        {faqs.map((f, i) => (
          <div key={i}>
            <p className="font-semibold text-gray-900">{i + 1}. {f.q}</p>
            <p className="text-gray-600 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
      <div className="card p-6 h-fit">
        <h3 className="font-bold text-gray-900 mb-4">Contact Support</h3>
        <div className="space-y-3 text-gray-700">
          <a href="mailto:support@mahadiagno.com" className="flex items-center gap-3 hover:text-primary"><Mail className="w-5 h-5 text-primary" /> support@mahadiagno.com</a>
          <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /> +91-9876543210</p>
          <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> Maharashtra, India</p>
        </div>
      </div>
    </div>
  </div>
)

export default Help

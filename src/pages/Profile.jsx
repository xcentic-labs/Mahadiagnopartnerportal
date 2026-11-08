import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Building2, Mail, Phone, MapPin, ImagePlus, Upload, FileText, Shield, LifeBuoy, ChevronRight, KeyRound } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Loader, ErrorState } from '../components/States'
import { usePartnerDetails } from '../hooks/usePartnerDetails'
import api, { errorMessage } from '../utils/api'
import { partnerBannerUrl } from '../utils/config'

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium break-words">{value || '—'}</p>
    </div>
  </div>
)

const links = [
  { title: 'Change Password', icon: KeyRound, to: '/forgot-password' },
  { title: 'Terms & Conditions', icon: FileText, to: '/terms' },
  { title: 'Privacy Policy', icon: Shield, to: '/privacy' },
  { title: 'Help & Support', icon: LifeBuoy, to: '/help' },
]

const Profile = () => {
  const { details, loading, error, refresh } = usePartnerDetails()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!f.type.startsWith('image/')) return toast.error('Please choose an image file')
    if (f.size > 5 * 1024 * 1024) return toast.error('Image should be less than 5MB')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    setUploading(true)
    try {
      await api.post(`/partners/uploadbanner/${details.id}`, fd)
      toast.success('Banner uploaded successfully')
      setFile(null)
      setPreview(null)
      refresh()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to upload banner'))
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <Loader text="Loading profile..." />
  if (error) return <ErrorState message={error} onRetry={refresh} />

  const a = details?.address || {}
  const fullAddress = [a.area, a.landmark, a.district].filter(Boolean).join(', ')
  const bannerSrc = preview || (details?.imageUrl ? partnerBannerUrl(details.imageUrl) : null)

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your hospital details as shown on MahaDiagno" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blueshade flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{details?.hospitalName}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${details?.isSubscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {details?.isSubscribed ? 'Subscribed' : 'Not subscribed'}
                </span>
              </div>
            </div>
            <Row icon={Mail} label="Email ID" value={details?.email} />
            <Row icon={Phone} label="Mobile Number" value={details?.phoneNumber && `+91 ${details.phoneNumber}`} />
            <Row icon={MapPin} label="Address" value={fullAddress} />
            <div className="grid grid-cols-2 gap-4">
              <Row icon={MapPin} label="State" value={a.state} />
              <Row icon={MapPin} label="Pincode" value={a.pincode} />
            </div>
            <p className="text-xs text-gray-400 mt-3">To update these details, contact support@mahadiagno.com.</p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Banner Image</h3>
            <p className="text-sm text-gray-500 mb-4">Shown to patients on your hospital listing.</p>
            <label className="block border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={pickFile} />
              {bannerSrc ? (
                <img src={bannerSrc} alt="Hospital banner" className="w-full h-56 object-cover" />
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                  <ImagePlus className="w-10 h-10" />
                  <p className="mt-2 text-sm">Click to choose an image</p>
                </div>
              )}
            </label>
            <div className="flex gap-3 mt-4">
              {file ? (
                <>
                  <button className="btn-outline" onClick={() => { setFile(null); setPreview(null) }} disabled={uploading}>Cancel</button>
                  <button className="btn-primary" onClick={upload} disabled={uploading}>
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Banner'}
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-500">Click the image area to {details?.imageUrl ? 'replace' : 'add'} your banner.</p>
              )}
            </div>
          </div>
        </div>

        <div className="card p-2 h-fit">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50">
              <span className="flex items-center gap-3 text-gray-700 font-medium"><l.icon className="w-5 h-5 text-primary" /> {l.title}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
          <p className="px-4 py-3 text-xs text-gray-400">Portal version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Profile

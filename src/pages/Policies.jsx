import PageHeader from '../components/PageHeader'

const terms = [
  ['Introduction', 'Welcome to the MahaDiagno Partner Portal. By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.'],
  ['Services Provided', 'The portal allows partner hospitals to list diagnostic services, manage appointments, manage service boys and receive payouts. Services are subject to availability and an active subscription.'],
  ['Partner Responsibilities', 'Partners must provide accurate hospital, service and bank information, and ensure that procedures are performed by qualified staff following applicable safety guidelines. Misuse may result in termination of access.'],
  ['Payments & Payouts', 'Subscription payments are processed through Razorpay. Withdrawal requests are reviewed by MahaDiagno before being transferred to your registered bank account.'],
  ['Limitations of Liability', 'While we strive to provide accurate and timely services, we are not liable for delays, inaccuracies, or service unavailability due to unforeseen circumstances.'],
  ['Changes to Terms', 'We may update these terms at any time. Continued use of the portal after changes indicates your acceptance of the new terms.'],
  ['Contact Information', 'If you have any questions about these Terms, please contact us at support@mahadiagno.com.'],
]

const privacy = [
  ['Introduction', 'This Privacy Policy explains how we collect, use, disclose and safeguard information when you use the MahaDiagno Partner Portal.'],
  ['Information We Collect', 'We collect hospital details, contact information, location, service details, bank details for payouts, and patient information related to appointments you handle.'],
  ['How We Use Your Information', 'Information is used to list your services, route appointments, dispatch service boys, process payments and payouts, and provide support.'],
  ['Sharing Your Information', 'We do not sell personal data. Information may be shared with patients, service boys and payment providers only as needed to deliver services.'],
  ['Data Security', 'We use industry-standard practices to protect your information. However, no system is 100% secure and we cannot guarantee absolute security.'],
  ['Data Retention', 'We retain data only as long as necessary for medical, legal or operational reasons, unless a longer period is required by law.'],
  ['Your Rights', 'You may request access to, correction of, or deletion of your data by contacting support.'],
  ['Contact Us', 'For privacy questions, contact support@mahadiagno.com.'],
]

const PolicyPage = ({ title, items }) => (
  <div>
    <PageHeader title={title} />
    <div className="card p-6 space-y-5 max-w-4xl">
      {items.map(([heading, body], i) => (
        <div key={heading}>
          <p className="font-semibold text-gray-900">{i + 1}. {heading}</p>
          <p className="text-gray-600 mt-1">{body}</p>
        </div>
      ))}
    </div>
  </div>
)

export const Terms = () => <PolicyPage title="Terms & Conditions" items={terms} />
export const Privacy = () => <PolicyPage title="Privacy Policy" items={privacy} />

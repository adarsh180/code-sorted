import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#05060f] text-indigo-100 font-sans">
      {/* Branded top bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05060f]/90 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo/logo.png" alt="CodeSorted" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-base font-bold tracking-tight text-white">
              Code<span className="text-indigo-400">Sorted</span>
            </span>
          </Link>
        </div>
      </header>
      <div className="py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Effective Date: 26/03/2026</p>
          <p className="text-gray-400 mt-1">Platform Name: Code-Sorted</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">1. INTRODUCTION</h2>
          <p className="text-gray-300 leading-relaxed">
            Welcome to Code-Sorted (“we”, “our”, “us”, or “Platform”).
          </p>
          <p className="text-gray-300 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, process, store, and protect your personal information when you use our website, services, and features (collectively, the “Services”).
          </p>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using Code-Sorted, you agree to the practices described in this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">2. SCOPE OF THIS POLICY</h2>
          <p className="text-gray-300 leading-relaxed">This Privacy Policy applies to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>All visitors and users of Code-Sorted</li>
            <li>Registered users and contributors</li>
            <li>Anyone interacting with our services, tools, or content</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">It covers data collected through:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Website usage</li>
            <li>Account creation</li>
            <li>Interactive features (including avatars, learning tools, etc.)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">3. INFORMATION WE COLLECT</h2>
          <p className="text-gray-300 leading-relaxed">We collect information to provide, improve, and secure our services. The types of information we collect include:</p>
          
          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.1 Personal Information</h3>
          <p className="text-gray-300 leading-relaxed">When you create an account or interact with the platform, we may collect:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Name or username</li>
            <li>Email address</li>
            <li>Profile preferences (including avatar selection, gender preference if provided)</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.2 Technical and Device Information</h3>
          <p className="text-gray-300 leading-relaxed">We may automatically collect:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Device type</li>
            <li>Screen resolution</li>
            <li>Referring URLs</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.3 Usage Data</h3>
          <p className="text-gray-300 leading-relaxed">This includes:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Pages visited</li>
            <li>Time spent on features</li>
            <li>Interaction patterns</li>
            <li>Click behavior</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">This helps us improve usability and performance.</p>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.4 IP Address and Location Data (IMPORTANT)</h3>
          <p className="text-gray-300 leading-relaxed">We collect your IP address as part of standard internet communication.</p>
          <p className="text-gray-300 leading-relaxed">From this, we may derive:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Approximate geographic location (such as city or region level)</li>
            <li>Network-related metadata</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Why this is collected:</p>
          <p className="text-gray-300 leading-relaxed">Your IP address and derived location data are used for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Security monitoring and fraud prevention</li>
            <li>Detecting suspicious or unauthorized access attempts</li>
            <li>Preventing abuse, bot activity, or malicious behavior</li>
            <li>Ensuring platform integrity and stability</li>
            <li>Supporting legal compliance when necessary</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We want to clarify:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>We do not track precise GPS-level location unless explicitly provided by you</li>
            <li>We do not sell or publicly disclose your IP address or location data</li>
            <li>This data is used internally to maintain a safe and reliable platform</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.5 Log Data</h3>
          <p className="text-gray-300 leading-relaxed">We maintain system logs that may include:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>IP address</li>
            <li>Login timestamps</li>
            <li>Device/session identifiers</li>
            <li>Error logs</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">These logs are essential for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Debugging</li>
            <li>Security auditing</li>
            <li>System performance monitoring</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">3.6 Cookies and Tracking Technologies</h3>
          <p className="text-gray-300 leading-relaxed">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Maintain user sessions</li>
            <li>Remember preferences</li>
            <li>Improve user experience</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">You can control cookies through your browser settings.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">4. HOW WE USE YOUR INFORMATION</h2>
          <p className="text-gray-300 leading-relaxed">We use collected data for the following purposes:</p>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">4.1 Service Delivery</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Creating and managing user accounts</li>
            <li>Providing access to educational content</li>
            <li>Enabling features like avatar generation</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">4.2 Personalization</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Customizing user experience</li>
            <li>Suggesting relevant content</li>
            <li>Generating personalized avatars</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">4.3 Security and Integrity</h3>
          <p className="text-gray-300 leading-relaxed">This is one of our core priorities.</p>
          <p className="text-gray-300 leading-relaxed">We use data (including IP and logs) to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Detect and prevent fraud</li>
            <li>Monitor suspicious activity</li>
            <li>Protect against unauthorized access</li>
            <li>Maintain system reliability</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">4.4 Analytics and Improvement</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Understanding user behavior</li>
            <li>Improving features and performance</li>
            <li>Optimizing UI/UX</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">4.5 Legal Compliance</h3>
          <p className="text-gray-300 leading-relaxed">We may use and retain data to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Comply with legal obligations</li>
            <li>Respond to lawful requests</li>
            <li>Enforce our Terms and Conditions</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">5. DATA SHARING AND DISCLOSURE</h2>
          <p className="text-gray-300 leading-relaxed">We value your privacy and do not sell your personal data.</p>
          <p className="text-gray-300 leading-relaxed">We may share data only in the following situations:</p>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">5.1 Legal Requirements</h3>
          <p className="text-gray-300 leading-relaxed">We may disclose information if required:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>By law, regulation, or court order</li>
            <li>To protect rights, safety, or property</li>
            <li>To investigate fraud or illegal activity</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">5.2 Service Providers</h3>
          <p className="text-gray-300 leading-relaxed">We may use trusted third-party services for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Hosting</li>
            <li>Analytics</li>
            <li>Security</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">These providers are required to maintain confidentiality and data protection standards.</p>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">5.3 Business Transfers</h3>
          <p className="text-gray-300 leading-relaxed">In case of:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Merger</li>
            <li>Acquisition</li>
            <li>Asset sale</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">User data may be transferred as part of the business, subject to privacy commitments.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">6. DATA RETENTION</h2>
          <p className="text-gray-300 leading-relaxed">We retain your data only as long as necessary:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>To provide services</li>
            <li>To maintain security logs</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">When data is no longer required, we take reasonable steps to delete or anonymize it.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">7. DATA SECURITY</h2>
          <p className="text-gray-300 leading-relaxed">We implement appropriate technical and organizational measures, including:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Encryption (where applicable)</li>
            <li>Secure servers and infrastructure</li>
            <li>Access control mechanisms</li>
            <li>Monitoring and anomaly detection systems</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">While we strive for high security, no system is completely immune to risks.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">8. USER RIGHTS AND CONTROL</h2>
          <p className="text-gray-300 leading-relaxed">Depending on your jurisdiction, you may have rights to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Access your personal data</li>
            <li>Request correction or updates</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">You may contact us to exercise these rights.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">9. ACCOUNT AND DATA DELETION</h2>
          <p className="text-gray-300 leading-relaxed">Users may request:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Account deletion</li>
            <li>Removal of associated data</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Some information may be retained if required for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Legal compliance</li>
            <li>Security and fraud prevention</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">10. CHILDREN’S PRIVACY</h2>
          <p className="text-gray-300 leading-relaxed">Code-Sorted is not intended for children under the age of 13.</p>
          <p className="text-gray-300 leading-relaxed">We do not knowingly collect personal data from children without parental consent.</p>
          <p className="text-gray-300 leading-relaxed">If such data is identified, we will take steps to delete it.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">11. THIRD-PARTY LINKS</h2>
          <p className="text-gray-300 leading-relaxed">Our platform may contain links to third-party websites.</p>
          <p className="text-gray-300 leading-relaxed">We are not responsible for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Their privacy practices</li>
            <li>Their content</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Users are encouraged to review third-party policies separately.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">12. INTERNATIONAL DATA USAGE</h2>
          <p className="text-gray-300 leading-relaxed">If you access Code-Sorted from outside your country:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
             <li>Your data may be processed in different jurisdictions</li>
             <li>By using the platform, you consent to such transfers</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">13. UPDATES TO THIS PRIVACY POLICY</h2>
          <p className="text-gray-300 leading-relaxed">We may update this Privacy Policy from time to time.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Updates will be posted on this page</li>
            <li>Continued use of the platform indicates acceptance</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">14. TRANSPARENCY NOTE ON IP & SECURITY USAGE</h2>
          <p className="text-gray-300 leading-relaxed">We believe in clarity and transparency.</p>
          <p className="text-gray-300 leading-relaxed">While IP address and location-derived data are collected, they are used:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Primarily for security and fraud prevention</li>
            <li>To ensure safe usage of the platform</li>
            <li>To protect users from malicious activity</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We do not use this data for intrusive surveillance or unnecessary tracking.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">15. CONTACT INFORMATION</h2>
          <p className="text-gray-300 leading-relaxed">If you have any questions or concerns:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Email: codesorted0704@gmail.com</li>
            <li>Platform: Code-Sorted</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">16. FINAL STATEMENT</h2>
          <p className="text-gray-300 leading-relaxed">By using Code-Sorted, you acknowledge that:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>You understand how your data is collected and used</li>
            <li>You agree to this Privacy Policy</li>
            <li>You trust us to handle your data responsibly and securely</li>
          </ul>
        </section>

        <section className="pt-8 border-t border-white/10">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-2">
            <span>&larr;</span> Back to Home
          </Link>
        </section>
      </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Terms and Conditions (Terms of Service)</h1>
          <p className="text-gray-400">Effective Date: {new Date().toLocaleDateString()}</p>
          <p className="text-gray-400 mt-1">Platform Name: Code-Sorted</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">1. INTRODUCTION</h2>
          <p className="text-gray-300 leading-relaxed">
            Welcome to Code-Sorted (“Platform”, “we”, “our”, or “us”). These Terms and Conditions (“Terms”) govern your access to and use of our website, services, applications, content, and features (collectively referred to as the “Services”).
          </p>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using Code-Sorted, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the Platform.
          </p>
          <p className="text-gray-300 leading-relaxed">
            These Terms apply to all users, including visitors, registered users, contributors, and anyone interacting with our Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">2. ELIGIBILITY</h2>
          <p className="text-gray-300 leading-relaxed">To use Code-Sorted:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>You must be at least 13 years of age (or higher if required by your jurisdiction).</li>
            <li>If you are under 18, you confirm that you are using the platform under parental or legal guardian supervision.</li>
            <li>You agree that all information you provide is accurate and up to date.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We reserve the right to suspend or terminate accounts that violate eligibility criteria.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">3. USER ACCOUNTS</h2>
          <p className="text-gray-300 leading-relaxed">To access certain features, you may be required to create an account.</p>
          <p className="text-gray-300 leading-relaxed">You agree to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Provide accurate and complete information.</li>
            <li>Maintain confidentiality of your login credentials.</li>
            <li>Be responsible for all activities under your account.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We are not liable for unauthorized access resulting from your failure to safeguard your account credentials.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">4. SERVICES PROVIDED</h2>
          <p className="text-gray-300 leading-relaxed">Code-Sorted provides:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Educational content (notes, coding material, tutorials).</li>
            <li>User-generated and curated learning resources.</li>
            <li>Avatar generation and personalization features.</li>
            <li>Community and interactive tools.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We reserve the right to modify, suspend, or discontinue any feature at any time without prior notice.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">5. DATA COLLECTION AND USAGE (IMPORTANT)</h2>
          <p className="text-gray-300 leading-relaxed">To ensure platform security, functionality, and personalization, we collect and process certain types of data.</p>
          
          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">5.1 Types of Data Collected</h3>
          <p className="text-gray-300 leading-relaxed">This may include:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Basic user information (name, email, preferences).</li>
            <li>Device information (browser type, operating system).</li>
            <li>IP address and approximate location data.</li>
            <li>Interaction data (pages visited, features used).</li>
            <li>Technical logs for debugging and security.</li>
          </ul>

          <h3 className="text-xl font-medium text-indigo-200 mt-6 mb-3">5.2 IP Address and Location Usage</h3>
          <p className="text-gray-300 leading-relaxed">Your IP address may be collected and processed for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Enhancing platform security and fraud detection.</li>
            <li>Preventing unauthorized access and malicious activities.</li>
            <li>Maintaining system integrity and performance.</li>
            <li>Supporting legal compliance when required.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We may derive approximate geographic location (such as city-level data) from your IP address. This is used to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Improve user experience.</li>
            <li>Detect suspicious or unusual activity.</li>
            <li>Maintain platform safety.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We do not sell or publicly share precise personal location data.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">6. SECURITY AND FRAUD PREVENTION</h2>
          <p className="text-gray-300 leading-relaxed">To protect users and maintain a secure environment:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>We monitor access patterns and unusual behaviors.</li>
            <li>We may log IP addresses and session activity.</li>
            <li>Automated systems may flag suspicious activity.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">If required, we may:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Temporarily restrict access.</li>
            <li>Suspend or terminate accounts.</li>
            <li>Cooperate with law enforcement authorities.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">This is done strictly to ensure safety, prevent misuse, and uphold legal obligations.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">7. USER RESPONSIBILITIES</h2>
          <p className="text-gray-300 leading-relaxed">You agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Engage in hacking, unauthorized access, or system interference.</li>
            <li>Attempt to bypass security mechanisms.</li>
            <li>Use the platform for illegal or fraudulent activities.</li>
            <li>Upload malicious code, scripts, or harmful content.</li>
            <li>Misrepresent identity or impersonate others.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Violation of these rules may result in immediate termination and legal action.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">8. INTELLECTUAL PROPERTY</h2>
          <p className="text-gray-300 leading-relaxed">All content on Code-Sorted, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Text, graphics, logos, and design.</li>
            <li>Course materials and notes.</li>
            <li>Software and features.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">are the property of Code-Sorted or its licensors.</p>
          <p className="text-gray-300 leading-relaxed">You may NOT:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Copy, reproduce, or redistribute content without permission.</li>
            <li>Use platform materials for commercial purposes without authorization.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">9. USER-GENERATED CONTENT</h2>
          <p className="text-gray-300 leading-relaxed">If you upload or share content:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>You retain ownership of your content.</li>
            <li>You grant us a license to use, display, and distribute it within the platform.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">You are responsible for ensuring your content:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Does not violate any laws.</li>
            <li>Does not infringe intellectual property rights.</li>
            <li>Is not harmful, abusive, or misleading.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">10. AVATAR GENERATION FEATURE</h2>
          <p className="text-gray-300 leading-relaxed">Code-Sorted may provide avatar generation tools.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Avatars are generated algorithmically based on user input.</li>
            <li>They are for representational and aesthetic purposes only.</li>
            <li>Users should not use avatars to impersonate real individuals.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">We reserve the right to modify or restrict avatar features at any time.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">11. THIRD-PARTY SERVICES</h2>
          <p className="text-gray-300 leading-relaxed">Our platform may integrate or link to third-party services.</p>
          <p className="text-gray-300 leading-relaxed">We are not responsible for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Their content.</li>
            <li>Their privacy practices.</li>
            <li>Their terms.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Users are advised to review third-party policies separately.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">12. LIMITATION OF LIABILITY</h2>
          <p className="text-gray-300 leading-relaxed">To the fullest extent permitted by law:</p>
          <p className="text-gray-300 leading-relaxed">Code-Sorted shall not be liable for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Indirect, incidental, or consequential damages.</li>
            <li>Data loss or service interruptions.</li>
            <li>Unauthorized access beyond reasonable control.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Use of the platform is at your own risk.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">13. DISCLAIMER OF WARRANTIES</h2>
          <p className="text-gray-300 leading-relaxed">We provide services on an “as-is” and “as-available” basis.</p>
          <p className="text-gray-300 leading-relaxed">We do not guarantee:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Continuous availability.</li>
            <li>Error-free functionality.</li>
            <li>Absolute security.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">While we implement strong safeguards, no system is completely immune to risks.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">14. ACCOUNT TERMINATION</h2>
          <p className="text-gray-300 leading-relaxed">We reserve the right to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Suspend or terminate accounts at our discretion.</li>
            <li>Remove content that violates these Terms.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Reasons may include:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Policy violations.</li>
            <li>Suspicious activity.</li>
            <li>Legal requirements.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Users may also request account deletion.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">15. LEGAL COMPLIANCE</h2>
          <p className="text-gray-300 leading-relaxed">We may disclose user information if required:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>By law or legal process.</li>
            <li>To protect rights, safety, or property.</li>
            <li>To prevent fraud or abuse.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Such actions are taken only when necessary and lawful.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">16. MODIFICATIONS TO TERMS</h2>
          <p className="text-gray-300 leading-relaxed">We may update these Terms periodically.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Changes will be posted on this page.</li>
            <li>Continued use of the platform indicates acceptance.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">Users are encouraged to review Terms regularly.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">17. GOVERNING LAW</h2>
          <p className="text-gray-300 leading-relaxed">These Terms shall be governed by and interpreted under the laws of:</p>
          <p className="text-gray-300 leading-relaxed font-semibold">India</p>
          <p className="text-gray-300 leading-relaxed">Any disputes shall be subject to the jurisdiction of appropriate courts in India.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">18. CONTACT INFORMATION</h2>
          <p className="text-gray-300 leading-relaxed">For any questions regarding these Terms:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>Email: support@code-sorted.com</li>
            <li>Platform: Code-Sorted</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-300">19. FINAL ACKNOWLEDGMENT</h2>
          <p className="text-gray-300 leading-relaxed">By using Code-Sorted, you acknowledge that:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>You understand how your data (including IP and location) may be used.</li>
            <li>You agree to comply with all platform rules.</li>
            <li>You accept responsibility for your actions on the platform.</li>
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

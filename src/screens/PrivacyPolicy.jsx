import React from 'react';
import { Link } from 'react-router-dom';
import './AuthScreen.css';

function PrivacyPolicy() {
  return (
    <div className="auth-screen">
      <div className="verify-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', maxWidth: 900 }}>
          <div className="auth-header" style={{ marginBottom: 16 }}>
            <h1>Cargo360</h1>
          </div>

          <h2>Privacy Policy for Cargo360</h2>
          <p><strong>Effective date:</strong> 2025-09-01</p>

          <h3>1. Who we are</h3>
          <p>Cargo360, we provides a logistics and truck booking application (the “App”).</p>
          <p>Contact: Cargo360 Plaza # 146, 5th Floor. Sector C commercial area Bahria Town Lahore. Email: info@cargo360pk.com</p>

          <h3>2. What this policy covers</h3>
          <p>This policy describes how we collect, use, share, and protect information when you use the Cargo360 App and related services.</p>

          <h3>3. Information we collect</h3>
          <ul>
            <li>Account information: name, email, phone number, password (hashed), and profile details you provide during signup or profile updates.</li>
            <li>Booking information: vehicle type, cargo type/description, pickup and drop locations, budget, timestamps, and booking status.</li>
            <li>Driver location data:
              <ul>
                <li>For in-transit shipments, driver devices share GPS coordinates (latitude, longitude), accuracy, speed, heading, and timestamps with our backend.</li>
                <li>Customers may view driver location data for their active shipments.</li>
              </ul>
            </li>
            <li>Device and technical data: app version, OS version, device model, and basic logs used for diagnostics and fraud prevention.</li>
            <li>Geocoding data: We may send coordinates to a reverse geocoding provider (e.g., Geoapify) to display a human-readable address in the App.</li>
            <li>Links to external maps: “See on Maps” opens Google Maps with pickup/current/drop; Google may process data under its own privacy policy.</li>
          </ul>

          <h3>4. How we use your information</h3>
          <ul>
            <li>Provide and operate the App (accounts, bookings, coordination, shipment progress).</li>
            <li>Location and tracking (drivers only) for near-real-time progress and updates.</li>
            <li>Customer experience (reverse geocoding, Google Maps directions links).</li>
            <li>Security and integrity (fraud/abuse/technical issues).</li>
            <li>Communications (booking/account/service updates).</li>
            <li>Legal compliance and enforcing terms.</li>
          </ul>

          <h3>5. Legal bases (EEA/UK users)</h3>
          <ul>
            <li>Contract, Legitimate interests, Consent (where required), Legal obligation.</li>
          </ul>

          <h3>6. Location data specifics</h3>
          <ul>
            <li>Drivers: share GPS data during active jobs; can stop by ending jobs or disabling location (may affect functionality).</li>
            <li>Customers: can only view their driver’s location for shipments in progress; we do not collect customer background location.</li>
          </ul>

          <h3>7. Data sharing</h3>
          <ul>
            <li>Service providers:
              <ul>
                <li>Reverse geocoding: Geoapify (<a href="https://www.geoapify.com/privacypolicy" target="_blank" rel="noreferrer">https://www.geoapify.com/privacypolicy</a>)</li>
                <li>Maps and directions: Google Maps (<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">https://policies.google.com/privacy</a>)</li>
              </ul>
            </li>
            <li>Affiliates/business transfers; Legal compliance. We do not sell personal data.</li>
          </ul>

          <h3>8. International data transfers</h3>
          <p>Your data may be processed in other countries; we apply appropriate safeguards where required.</p>

          <h3>9. Data retention</h3>
          <ul>
            <li>Retained as needed for service, legal, dispute, and tax purposes; then deleted or anonymized.</li>
            <li>Examples: account while active; booking/location logs as operationally/legally required.</li>
          </ul>

          <h3>10. Security</h3>
          <p>We use measures like HTTPS/TLS, token auth, and secure storage. No method is 100% secure.</p>

          <h3>11. Your rights</h3>
          <p>Depending on jurisdiction: access, correction, deletion, restriction, portability, objection. Contact: info@cargo360pk.com</p>

          <h3>12. Children’s privacy</h3>
          <p>Not directed to children under 13 (or local minimum). If a child’s data is provided, contact us to delete.</p>

          <h3>13. Permissions and platform disclosures</h3>
          <ul>
            <li>Location: drivers for live tracking; customers view shipment-in-progress location.</li>
            <li>Camera: not used.</li>
            <li>Notifications (if enabled): booking/account updates.</li>
            <li>External links: Google Maps opens externally under Google policies.</li>
          </ul>

          <h3>14. Third-party privacy policies</h3>
          <ul>
            <li>Geoapify: <a href="https://www.geoapify.com/privacypolicy" target="_blank" rel="noreferrer">https://www.geoapify.com/privacypolicy</a></li>
            <li>Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">https://policies.google.com/privacy</a></li>
          </ul>

          <h3>15. Changes to this policy</h3>
          <p>We may update periodically; we’ll post updates in the App or website and update the effective date.</p>

          <h3>16. Contact us</h3>
          <p>Cargo360 Plaza # 146, 5th Floor. Sector C commercial area Bahria Town Lahore. Email: info@cargo360pk.com</p>

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
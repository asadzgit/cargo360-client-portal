import React from "react";
export const ClientFooter = () => (
  <footer className="screen-footer" style={{ textAlign: 'center', marginTop: 4, color: '#ffffff', background: 'linear-gradient(135deg, var(--primary-color) 0%, #02396b 100%)', padding: '2.5rem 0' }}>
    Contact support: info@cargo360pk.com
    <br></br>
    <small>© {new Date().getFullYear()} CARGO 360. All rights reserved.</small>
  </footer>
);
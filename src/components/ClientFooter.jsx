import React from "react";
import { FaSquareEnvelope, FaSquarePhone } from "react-icons/fa6";
export const ClientFooter = () => (
  <footer className="screen-footer" style={{  marginTop: 4, color: '#ffffff', background: 'linear-gradient(135deg, var(--primary-color) 0%, #02396b 100%)', padding: '2rem 0' }}>
    <>
    Contact support:
    <br/>
    <div style={{marginTop: '0.5rem'}}>
    <FaSquareEnvelope style={{color: '#ed8411'}}/> info@cargo360pk.com
    <span style={{margin: '0 0.5rem'}}></span>
    <FaSquarePhone style={{color: '#ed8411'}}/> +92 333 7766609
    </div>
    <small style={{marginTop: '0.5rem'}}>© {new Date().getFullYear()} CARGO 360. All rights reserved.</small>
    </>
  </footer>
);
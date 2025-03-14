import { Facebook, Twitter, Instagram, Linkedin } from "react-bootstrap-icons";
import "./u7dk3k93hdF83.css";
const Footer = () => {
  return (
    <footer className="footerr">
      <h4>Follow Us</h4>
      {/* Social Media Icons */}
      <div className="social-icons" >
        <a href="/" aria-label="Facebook" style={{margin: "15px"}}>
          <Facebook />
        </a>
        <a href="/" aria-label="Twitter" style={{margin: "15px", paddingBottom: "15px"}}>
          <Twitter />
        </a>
        <a href="/" aria-label="Instagram" style={{margin: "15px"}}>
          <Instagram />
        </a>
        <a href="/" aria-label="LinkedIn" style={{margin: "15px"}}>
          <Linkedin />
        </a>
    
      </div>

      {/* Footer Links */}
      

      {/* Copyright */}
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} FlyNet Downloader. All rights reserved.</p> Contact: <span>support@flynet.com</span>
      </div>
    </footer>
  );
};

export default Footer;
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <>
      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* 1. Brand Section */}
            <div>
              <div 
                className="flex items-center space-x-2 mb-6 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-8 h-8 bg-[#355872] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">Sigvanta</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your premier destination for high-quality gear, electronics, and lifestyle products. We bring the best of the world directly to your doorstep.
              </p>
            </div>

            {/* 2. Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => navigate("/products")} className="hover:text-white transition-colors">Shop All</button></li>
                <li><button className="hover:text-white transition-colors">Special Offers</button></li>
                <li><button className="hover:text-white transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* 3. Customer Service */}
            <div>
              <h3 className="text-white text-lg font-bold uppercase tracking-widest text-sm mb-6">Customer Service</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button className="hover:text-white transition-colors">Track Order</button></li>
                <li><button className="hover:text-white transition-colors">Returns & Exchanges</button></li>
                <li><button className="hover:text-white transition-colors">Shipping Info</button></li>
                <li><button className="hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>

            {/* 4. Contact Us & Socials */}
            <div>
              <h3 className="text-white text-lg font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium mb-8">
                {/* Phone Icon & Text */}
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[#7fa0b9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (800) 123-4567</span>
                </li>
                {/* Email Icon & Text */}
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[#7fa0b9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@sigvanta.com</span>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="flex space-x-4">
                {/* Instagram Icon */}
                <button className="text-slate-400 hover:text-rose-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Facebook Icon */}
                <button className="text-slate-400 hover:text-[#7fa0b9] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Legal/Copyright Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} Sigvanta. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;
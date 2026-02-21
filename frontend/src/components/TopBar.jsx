import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Globe } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="bg-slate-900 text-white py-2.5 px-6 hidden sm:block">
            <div className="container mx-auto flex justify-between items-center">
                {/* Contact Info */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Phone size={12} className="text-blue-500" />
                        <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Mail size={12} className="text-blue-500" />
                        <span>support@vagwiin.com</span>
                    </div>
                </div>

                {/* Secondary Links & Socials */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
                        <Facebook size={14} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
                        <Instagram size={14} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
                        <Twitter size={14} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                        <Globe size={12} />
                        <span>India / English</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

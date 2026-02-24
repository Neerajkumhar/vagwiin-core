import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();

    return (
        <footer className="bg-slate-50 border-t border-gray-100 pt-20 md:pt-32 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20">
                    <div className="col-span-1">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter">
                            {settings.siteName.toUpperCase()}<span className="text-blue-600">.</span>
                        </h2>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8 italic">
                            {settings.homepageBannerText}
                        </p>
                        <div className="flex gap-4">
                            {settings.socialLinks?.facebook && (
                                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings.socialLinks?.instagram && (
                                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings.socialLinks?.twitter && (
                                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {settings.socialLinks?.linkedin && (
                                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Shop Tech</h4>
                        <ul className="space-y-4">
                            {['MacBooks', 'Workstations', 'Gaming Laptops', 'UltraBooks', 'Office Series'].map(item => (
                                <li key={item} className="text-gray-400 font-bold hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group italic">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Support</h4>
                        <ul className="space-y-4">
                            <li className="text-gray-400 font-bold hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group italic">
                                <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                <Link to="/warranty">Warranty Status</Link>
                            </li>
                            <li className="text-gray-400 font-bold hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group italic">
                                <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                <Link to="/contact">Repair Service</Link>
                            </li>
                            {['Corporate Sales', 'Privacy Policy', 'Terms of Service'].map(item => (
                                <li key={item} className="text-gray-400 font-bold hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2 group italic">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Headquarters</h4>
                        <p className="text-gray-400 font-bold leading-relaxed italic mb-4 whitespace-pre-line">
                            {settings.address}
                        </p>
                        <div className="space-y-2">
                            <p className="text-blue-600 font-black tracking-tight flex items-center gap-2">
                                <Phone size={14} /> {settings.contactPhone}
                            </p>
                            <p className="text-gray-400 font-medium flex items-center gap-2">
                                <Mail size={14} /> {settings.contactEmail}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">
                        © {new Date().getFullYear()} {settings.siteName.toUpperCase()} CORE SYSTEMS PVT LTD. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest cursor-pointer hover:text-blue-400">Security</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest cursor-pointer hover:text-blue-400">Compliance</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest cursor-pointer hover:text-blue-400">Sitemap</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BiLogoGmail } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { IoLogoLinkedin, IoLogoTwitter, IoLogoWhatsapp } from 'react-icons/io5';
import { IoMdMail } from "react-icons/io";
import { IoLogoWhatsapp } from 'react-icons/io5';
import { BiLogoGmail } from 'react-icons/bi';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      website: formData.get('website'),
      message: formData.get('message'),
      metadata: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    };

    try {
      // Dynamic import to reduce initial bundle size and defer Supabase loading
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase
        .from('messages')
        .insert([data]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Message sent successfully!' });
      e.target.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className='lg:my-16 lg:px-28 my-8 px-5'
      id='contact'
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className='text-2xl lg:text-4xl text-center'
      >
        Contact <span className='font-extrabold'>Me</span>
      </motion.h2>

      <div className='flex justify-between items-center mt-8 lg:mt-16 flex-col lg:flex-row'>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className='lg:w-[40%]'
        >
          <form onSubmit={handleSubmit} className='w-full space-y-3 lg:space-y-5'>
            <input name="name" className='border-2 px-5 py-3 border-black rounded placeholder:text-[#71717A] text-sm w-full' type="text" placeholder='Your name' required />
            <input name="email" className='border-2 px-5 py-3 border-black rounded placeholder:text-[#71717A] text-sm w-full' type="email" placeholder='Email' required />
            <input name="website" className='border-2 px-5 py-3 border-black rounded placeholder:text-[#71717A] text-sm w-full' type="text" placeholder='Your website (If exists)' />
            <textarea name="message" className='resize-none border-2 px-5 py-3 h-32 border-black placeholder:text-[#71717A]  rounded text-sm w-full' placeholder='How can I help?*' required></textarea>

            {status.message && (
              <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className='flex justify-between gap-3 lg:gap-5 flex-col lg:flex-row'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={loading}
                type='submit'
                className='bg-black justify-center w-fit lg:w-auto lg:flex-1 hover:shadow-lg text-white px-3 py-2 rounded flex items-center gap-x-3 font-medium disabled:opacity-50'
              >
                {loading ? 'Sending...' : 'Get In Touch'}
              </motion.button>

              <div className='flex items-center gap-x-2 lg:gap-x-5'>
                {[
                  { Icon: BiLogoGmail, href: "mailto:contact@alinasr.com", label: "Email Ali Nasr" },
                  { Icon: IoLogoWhatsapp, href: "https://wa.me/201149030170", label: "Contact Ali Nasr on WhatsApp" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="bg-white p-2 lg:p-3 rounded border-2 border-black"
                    whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.Icon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className='lg:w-1/2'
        >
          <div className='font-extrabold text-2xl lg:text-5xl mt-5 lg:mt-0 space-y-1 lg:space-y-3'>
            <h2>Let's <span className='text-white' style={{ WebkitTextStroke: '1px black' }}>talk</span> for</h2>
            <h2>Something special</h2>
          </div>

          <p className='text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-6'>I seek to push the limits of creativity to create high-engaging, user-friendly, and memorable interactive experiences.</p>

          <div className='font-semibold text-sm lg:text-xl flex flex-col mt-6 gap-2 lg:gap-4'>
            <motion.a
              whileHover={{ x: 5 }}
              className='flex items-center gap-2 group'
              href="mailto:contact@alinasr.com"
              aria-label="Email Ali Nasr"
            >
              <span className='border-2 transition-all border-transparent group-hover:border-black rounded-full p-1'>
                <IoMdMail className="w-4 h-4 lg:w-5 lg:h-5" />
              </span>
              contact@alinasr.com
            </motion.a>

            <motion.a
              whileHover={{ x: 5 }}
              className='flex items-center gap-2 group'
              href="https://wa.me/201149030170"
              aria-label="Contact Ali Nasr on WhatsApp"
            >
              <span className='border-2 transition-all border-transparent group-hover:border-black rounded-full p-[5px]'>
                <IoLogoWhatsapp className="w-3 h-3 lg:w-4 lg:h-4" />
              </span>
              +201149030170
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

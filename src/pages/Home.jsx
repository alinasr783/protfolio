import React from "react";
import { m } from "framer-motion";
import { IoLogoLinkedin, IoLogoTwitter, IoLogoWhatsapp } from "react-icons/io5";
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <div className="mt-20" id="home">
      <div className="flex justify-between py-10 items-center px-5 lg:px-28 lg:flex-row flex-col-reverse">

        <m.div
          className="lg:w-[45%]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >

          <m.div
            className="text-2xl lg:text-5xl flex flex-col mt-8 lg:mt-0 gap-2 lg:gap-5 text-nowrap"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2, ease: "easeInOut" },
              },
            }}
          >
            <m.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              Hello, <TypeAnimation
                sequence={[
                  'I am Ali Nasr',
                  1000,
                  'I am a Full Stack Developer',
                  1000,
                  'I am a Frontend Expert',
                  1000,
                  'I am a Web Development',
                  1000,
                ]}
                speed={10}
                style={{ fontWeight:600 }}
                repeat={Infinity}
              />
            </m.h2>
            <m.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <span className="font-extrabold">Fullstack</span>{" "}
              <span
                className="text-white font-extrabold"
                style={{ WebkitTextStroke: "1px black" }}
              >
                Developer
              </span>
            </m.h2>
          </m.div>

          <m.p
            className="text-[#71717A] text-sm lg:text-base mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Full Stack Software Engineer focused on building scalable web applications. Experienced in developing end-to-end solutions using modern technologies.
          </m.p>

          <m.div
            className="flex items-center gap-x-5 mt-10 lg:mt-14"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {[
              { Icon: BiLogoGmail, href: "mailto:contact@alinasr.com", label: "Email Ali Nasr" },
              { Icon: IoLogoWhatsapp, href: "https://wa.me/201149030170", label: "Contact Ali Nasr on WhatsApp" },
            ].map((social, index) => (
              <m.a
                key={index}
                href={social.href}
                className="bg-white p-2 lg:p-3 rounded border-2 border-black"
                whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
                title={social.label}
              >
                <social.Icon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              </m.a>
            ))}
          </m.div>
        </m.div>

        <m.div
          className="lg:w-[55%] w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <img 
            className="h-full w-full" 
            src="/assets/hero-vector.svg" 
            alt="Hero Vector" 
            width="600" 
            height="400" 
            fetchpriority="high"
            loading="eager"
            decoding="async"
          />
        </m.div>
      </div>
    </div>
  );
}

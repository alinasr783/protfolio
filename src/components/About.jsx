import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="px-5 lg:px-28 flex justify-between flex-col lg:flex-row my-10 lg:my-20" id="about">
      <motion.div
        className="lg:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        viewport={{ once: true }}
      >
        <img src="/assets/about-me.svg" alt="About Me Illustration" width="500" height="400" loading="lazy" />
      </motion.div>

      <motion.div
        className="lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="lg:text-4xl text-2xl mt-4 lg:mt-0">
          something about <span className="font-extrabold">me</span>
        </h2>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-5 lg:mt-10">
          Hi, I’m <strong>Ali Nasr</strong>, a professional <strong>Full Stack Developer</strong> and product builder specializing in creating modern, high-performance websites and web applications.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5">
          I don’t just build websites — I build complete digital solutions that help businesses grow, attract customers, and operate more efficiently.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5">
          I work with technologies like <strong>React, Next.js, Supabase, and Firebase</strong> to develop fast, scalable, and user-friendly systems. From simple landing pages to advanced platforms with dashboards, automation, and custom logic — I can handle it.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5">
          I have experience building real-world projects, including booking systems, SaaS platforms, and business websites tailored to specific needs.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5">
          My focus is always on delivering clean design, smooth user experience, and real business impact — not just code.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5 italic font-medium">
          If you’re looking for someone who understands both development and business, and can turn your idea into a fully functional product, I’d be happy to work with you.
        </p>

      </motion.div>
    </div>
  );
}

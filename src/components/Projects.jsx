import React from 'react';
import { TbExternalLink } from "react-icons/tb";
import { m } from 'framer-motion';

import tabibiImg from "../assets/projects/tabibi.png";
import taapostImg from "../assets/projects/taapost.png";
import orchidImg from "../assets/projects/orchid.png";
import elsokhnaImg from "../assets/projects/elsokhna.png";

const projects = [
  {
    id: 1,
    title: "Tabibi - New generation of clinic management systems",
    description: "Tabibi is an all-in-one smart platform built to simplify and transform clinics management. It empowers doctors to manage patients, appointments, and clinics effortlessly—while delivering a seamless, modern experience powered by intelligent technology. Fast, intuitive, and built for growth, Tabibi is redefining how healthcare works.",
    image: tabibiImg,
    link: "https://tabibi.site"
  },
  {
    id: 2,
    title: "TaaPost - Digital media platform",
    description: "Where the pulse of Taiz meets the vision of the Arab world. We bridge the gap between breaking news and deep intellectual analysis, crafting a narrative that empowers voices and uncovers the truth from the heart of Yemen.",
    image: taapostImg,
    link: "https://www.taapost.com"
  },
  {
    id: 3,
    title: "Orchid Chemicals",
    description: "Orchid Chemicals focuses on supplying high-purity chemicals, APIs, and advanced laboratory equipment sourced from leading global manufacturers. The project aims to support research institutions and the scientific community in Egypt by enabling access to reliable, high-quality materials that drive innovation and research excellence.",
    image: orchidImg,
    link: "https://www.orchidchemi.com"
  },
  {
    id: 4,
    title: "Website for a yacht rental company in Hurghada",
    description: "A modern, high-performance website for a luxury yacht rental service in Hurghada. Built with React and Tailwind CSS, it features a responsive design, interactive booking inquiries, and a seamless user experience to showcase premium marine experiences.",
    image: elsokhnaImg,
    link: "https://elsokhnayatchs.com"
  }
];

export default function Projects() {
  return (
    <div className="bg-black px-5 lg:px-28 py-8 my-8 lg:py-16 lg:my-16" id="projects">
      <h2 className="text-2xl lg:text-4xl text-center text-white">
        Some Of My <span className="font-extrabold">Projects</span>
      </h2>

      <div className="lg:mt-16 mt-8 lg:space-y-16 space-y-8 lg:pb-6 pb-3">
        {projects.map((project, index) => (
          <m.div
            key={project.id}
            className={`flex justify-between items-center flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 10, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-[500px] w-full rounded-2xl overflow-hidden">
              <img
                className="w-full h-full hover:scale-105 transition-all duration-500 cursor-pointer object-cover"
                src={project.image}
                alt={project.title}
                width="500"
                height="300"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />
            </div>

            <div className="lg:w-1/2 lg:space-y-6 space-y-4">
              <h2 className="font-extrabold text-white mt-5 lg:mt-0 text-3xl lg:text-5xl">
                {String(project.id).padStart(2, "0")}
              </h2>
              <p className="font-bold text-white text-xl lg:text-3xl">{project.title}</p>

              <p className="font-light text-sm/6 lg:text-base text-[#71717A]">
                {project.description}
              </p>
              <a href={project.link} className="text-white mt-3 block" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} project`}>
                <TbExternalLink size={23} />
              </a>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}

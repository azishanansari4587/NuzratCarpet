"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

const Project = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" }) // ✅ DB/API se fetch
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section>
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="text-center">
          <p className="text-5xl text-center font-Open text-gray-700">
            <span className="text-amber-700">Projects</span> from the World of{" "}
            <span className="text-amber-700">Nuzrat Carpet Emporium</span>
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li
              key={project.id}
              // className={
              //   index === 2
              //     ? "lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
              //     : ""
              // }
            >
              <div className="group relative block">
                <Image
                  src={project.imageUrl}
                  alt={project.id}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Project

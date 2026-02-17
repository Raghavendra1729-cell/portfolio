import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';

// Force dynamic execution so it doesn't cache the response
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. CLEAR EXISTING DATA (To prevent duplicates)
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Skill.deleteMany({}),
      Achievement.deleteMany({}),
      CPProfile.deleteMany({}),
    ]);

    // 2. PREPARE DATA
    
    // --- SKILLS ---
    const skills = [
      {
        category: "Languages",
        items: ["Java", "Python", "JavaScript", "TypeScript", "C++", "SQL"]
      },
      {
        category: "Backend",
        items: ["Node.js", "Express", "Spring Boot", "Django", "Socket.IO", "Kafka"]
      },
      {
        category: "Frontend",
        items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"]
      },
      {
        category: "Databases",
        items: ["MongoDB", "PostgreSQL", "Redis", "MySQL"]
      },
      {
        category: "DevOps & Tools",
        items: ["Docker", "Git", "GitHub", "AWS (EC2, S3)", "Linux"]
      }
    ];

    // --- EDUCATION ---
    const education = [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "BITS Pilani",
        startDate: "2023",
        endDate: "2026",
        grade: "8.5 CGPA",
        coursework: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS"]
      },
      {
        degree: "Software Engineering UG Program",
        institution: "Scaler School of Technology",
        startDate: "2023",
        endDate: "2027",
        grade: "Top 1%",
        coursework: ["System Design", "Full Stack Development", "Low Level Design"]
      }
    ];

    // --- EXPERIENCE ---
    const experience = [
      {
        role: "Backend Engineering Intern",
        company: "TechStartup Inc.",
        location: "Remote",
        startDate: "May 2025",
        endDate: "Present",
        current: true,
        description: [
          "Optimized API latency by 40% using Redis caching strategies.",
          "Built a real-time notification service using Socket.IO and Node.js.",
          "Collaborated with the frontend team to integrate RESTful APIs."
        ],
        technologies: ["Node.js", "Redis", "AWS", "MongoDB"]
      }
    ];

    // --- PROJECTS ---
    const projects = [
      {
        title: "Lost n Found",
        description: "A full-stack platform connecting users to report and recover lost items. Features real-time chat, image uploads, and location-based matching. Built with scalable architecture in mind.",
        techStack: ["MERN Stack", "Socket.IO", "Cloudinary", "Leaflet Maps"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" },
          { name: "Live Demo", url: "https://lost-n-found-demo.com" }
        ],
        featured: true,
        startDate: "Jan 2025",
        endDate: "Feb 2025"
      },
      {
        title: "Multi-threaded HTTP Server",
        description: "A custom HTTP server built from scratch in Python using low-level socket programming. Handles concurrent client requests using threading and supports basic HTTP methods (GET, POST).",
        techStack: ["Python", "Socket Programming", "Multi-threading", "Networking"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" }
        ],
        featured: true,
        startDate: "Nov 2024",
        endDate: "Dec 2024"
      },
      {
        title: "Sleep Quality Prediction",
        description: "Machine Learning analysis project utilizing classification algorithms to predict sleep quality based on lifestyle factors. Achieved 92% accuracy using Random Forest.",
        techStack: ["Python", "Scikit-Learn", "Pandas", "Matplotlib"],
        links: [
          { name: "Notebook", url: "https://github.com/raghavendra1729-cell" }
        ],
        featured: false,
        startDate: "Oct 2024",
        endDate: "Nov 2024"
      }
    ];

    // --- CP PROFILES ---
    const cpProfiles = [
      {
        platform: "LeetCode",
        username: "raghavendra1729",
        rating: 1750,
        maxRating: 1750,
        rank: "Knight",
        solvedCount: 700,
        profileUrl: "https://leetcode.com/u/raghavendra1729"
      },
      {
        platform: "CodeChef",
        username: "raghavendra_cc",
        rating: 1680,
        maxRating: 1680,
        rank: "3-Star",
        solvedCount: 200,
        profileUrl: "https://codechef.com"
      },
      {
        platform: "Codeforces",
        username: "raghavendra_cf",
        rating: 1210,
        maxRating: 1210,
        rank: "Pupil",
        solvedCount: 150,
        profileUrl: "https://codeforces.com"
      }
    ];

    // --- ACHIEVEMENTS ---
    const achievements = [
      {
        title: "Hackathon Winner - Hostel Hub",
        organization: "TechWeek 2025",
        date: "Jan 2026",
        description: "Ranked 7th out of 150+ teams. Built an inventory management app for hostels.",
        links: [{ name: "Certificate", url: "#" }]
      }
    ];

    // 3. INSERT DATA
    await Skill.insertMany(skills);
    await Education.insertMany(education);
    await Experience.insertMany(experience);
    await Project.insertMany(projects);
    await CPProfile.insertMany(cpProfiles);
    await Achievement.insertMany(achievements);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully!",
      stats: {
        skills: skills.length,
        education: education.length,
        experience: experience.length,
        projects: projects.length,
        cpProfiles: cpProfiles.length,
        achievements: achievements.length
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
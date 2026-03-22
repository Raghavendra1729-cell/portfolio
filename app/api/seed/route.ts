import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { authenticateAdminSecret, isAuthenticated } from "@/lib/auth";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";
import CPProfile from "@/models/CPProfile";

export const dynamic = "force-dynamic";

function authorizeSeedRequest(req: NextRequest) {
  const suppliedSecret = req.headers.get("x-admin-secret");
  return isAuthenticated(req) || authenticateAdminSecret(suppliedSecret);
}

export async function POST(req: NextRequest) {
  if (!authorizeSeedRequest(req)) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authorized to run the seed job.",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Skill.deleteMany({}),
      Achievement.deleteMany({}),
      CPProfile.deleteMany({}),
    ]);

    const skills = [
      {
        category: "Backend",
        items: ["Node.js", "Express", "MongoDB", "Socket.IO", "REST API Design", "Redis"],
      },
      {
        category: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        category: "LLD",
        items: ["OOP Design", "Concurrency", "HTTP Internals", "System Design Basics"],
      },
      {
        category: "Machine Learning",
        items: ["Random Forest", "scikit-learn", "Pandas", "Feature Engineering"],
      },
    ];

    const education = [
      {
        degree: "Software Engineering UG Program",
        institution: "Scaler School of Technology",
        startDate: "2023",
        endDate: "2027",
        grade: "Top 1% cohort performance",
      },
    ];

    const experience = [
      {
        role: "Teaching Assistant Buddy",
        company: "Scaler School of Technology",
        location: "Remote",
        startDate: "2025",
        endDate: "Present",
        current: true,
        description: [
          "Mentored students on backend engineering fundamentals and problem-solving patterns.",
          "Supported debugging sessions, code reviews, and technical clarification for live coursework.",
        ],
        technologies: ["Java", "Node.js", "Data Structures", "Algorithms"],
      },
    ];

    const projects = [
      {
        title: "Lost n Found",
        description:
          "MERN + Socket.IO platform for reporting, matching, and resolving lost-item cases with real-time updates.",
        techStack: ["MongoDB", "Express", "React", "Node.js", "Socket.IO"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" },
        ],
        featured: true,
        startDate: "2025",
        endDate: "2025",
      },
      {
        title: "Hostel Hub",
        description:
          "Inventory app for hostel operations that secured 7th place out of 150+ teams during a hackathon build sprint.",
        techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" },
        ],
        featured: true,
        startDate: "2025",
        endDate: "2025",
      },
      {
        title: "Sleep Quality Predictor",
        description:
          "Random Forest ML project predicting sleep quality with 86% accuracy and a feature-driven analysis workflow.",
        techStack: ["Python", "scikit-learn", "Pandas", "Matplotlib"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" },
        ],
        featured: false,
        startDate: "2024",
        endDate: "2024",
      },
      {
        title: "Multi-threaded HTTP Server",
        description:
          "Python HTTP server built with sockets and worker threads to handle concurrent requests and manual response generation.",
        techStack: ["Python", "Sockets", "Threading", "HTTP"],
        links: [
          { name: "GitHub", url: "https://github.com/raghavendra1729-cell" },
        ],
        featured: false,
        startDate: "2024",
        endDate: "2024",
      },
    ];

    const cpProfiles = [
      {
        platform: "LeetCode",
        username: process.env.LEETCODE_USERNAME || "raghavendra1729",
        rating: 1750,
        maxRating: 1750,
        rank: "365-day streak",
        solvedCount: 700,
        profileUrl: `https://leetcode.com/u/${process.env.LEETCODE_USERNAME || "raghavendra1729"}`,
        dataSource: "seed",
        lastSyncedAt: new Date(),
        fallbackEnabled: true,
      },
      {
        platform: "Codeforces",
        username: process.env.CODEFORCES_USERNAME || "raghavendra_cf",
        rating: 1210,
        maxRating: 1210,
        rank: "Pupil",
        solvedCount: 150,
        profileUrl: `https://codeforces.com/profile/${process.env.CODEFORCES_USERNAME || "raghavendra_cf"}`,
        dataSource: "seed",
        lastSyncedAt: new Date(),
        fallbackEnabled: true,
      },
      {
        platform: "CodeChef",
        username: process.env.CODECHEF_USERNAME || "raghavendra_cc",
        rating: 1680,
        maxRating: 1680,
        rank: "3-Star",
        solvedCount: 200,
        profileUrl: `https://www.codechef.com/users/${process.env.CODECHEF_USERNAME || "raghavendra_cc"}`,
        dataSource: "seed",
        lastSyncedAt: new Date(),
        fallbackEnabled: true,
      },
    ];

    const achievements = [
      {
        title: "Hostel Hub Hackathon Finalist",
        organization: "Campus Hackathon",
        date: "2025",
        description: "Built Hostel Hub and finished 7th out of 150+ participating teams.",
      },
    ];

    await Skill.insertMany(skills);
    await Education.insertMany(education);
    await Experience.insertMany(experience);
    await Project.insertMany(projects);
    await CPProfile.insertMany(cpProfiles);
    await Achievement.insertMany(achievements);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully.",
      stats: {
        skills: skills.length,
        education: education.length,
        experience: experience.length,
        projects: projects.length,
        cpProfiles: cpProfiles.length,
        achievements: achievements.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

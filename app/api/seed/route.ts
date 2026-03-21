import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Skill from '@/models/Skill';
import Achievement from '@/models/Achievement';
import CPProfile from '@/models/CPProfile';
import { PORTFOLIO_DATA_TAG, getCollectionTag } from '@/lib/data';

export const dynamic = 'force-dynamic';

const linkSchema = z.object({
  name: z.string().trim().min(1),
  url: z.string().trim().min(1),
}).strict();

const skillSchema = z.object({
  category: z.string().trim().min(1),
  items: z.array(z.string().trim().min(1)).min(1),
}).strict();

const educationSchema = z.object({
  degree: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  startDate: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
  grade: z.string().trim().min(1).optional(),
  coursework: z.array(z.string().trim().min(1)).default([]),
  attachments: z.array(z.string().trim().min(1)).default([]),
}).strict();

const experienceSchema = z.object({
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: z.string().trim().min(1).optional(),
  startDate: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
  current: z.boolean().optional(),
  description: z.array(z.string().trim().min(1)).default([]),
  technologies: z.array(z.string().trim().min(1)).default([]),
  logo: z.string().trim().min(1).optional(),
  attachments: z.array(z.string().trim().min(1)).default([]),
  links: z.array(linkSchema).default([]),
}).strict();

const projectSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  techStack: z.array(z.string().trim().min(1)).default([]),
  links: z.array(linkSchema).default([]),
  images: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().optional(),
  startDate: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
}).strict();

const cpProfileSchema = z.object({
  platform: z.string().trim().min(1),
  username: z.string().trim().min(1).optional(),
  rating: z.number().finite().optional(),
  maxRating: z.number().finite().optional(),
  rank: z.string().trim().min(1).optional(),
  solvedCount: z.number().int().nonnegative().optional(),
  profileUrl: z.string().trim().url().optional(),
  images: z.array(z.string().trim().min(1)).default([]),
}).strict();

const achievementSchema = z.object({
  title: z.string().trim().min(1),
  organization: z.string().trim().min(1).optional(),
  date: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  images: z.array(z.string().trim().min(1)).default([]),
  links: z.array(linkSchema).default([]),
}).strict();

const seedPayloadSchema = z.object({
  achievements: z.array(achievementSchema),
  cpProfiles: z.array(cpProfileSchema),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
}).strict();

const rawSeedPayload = {
  skills: [
    {
      category: 'Languages',
      items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'SQL'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'Spring Boot', 'Django', 'Socket.IO', 'Kafka'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
    },
    {
      category: 'Databases',
      items: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'],
    },
    {
      category: 'DevOps & Tools',
      items: ['Docker', 'Git', 'GitHub', 'AWS (EC2, S3)', 'Linux'],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'BITS Pilani',
      startDate: '2023',
      endDate: '2026',
      grade: '8.5 CGPA',
      coursework: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS'],
    },
    {
      degree: 'Software Engineering UG Program',
      institution: 'Scaler School of Technology',
      startDate: '2023',
      endDate: '2027',
      grade: 'Top 1%',
      coursework: ['System Design', 'Full Stack Development', 'Low Level Design'],
    },
  ],
  experience: [
    {
      role: 'Backend Engineering Intern',
      company: 'TechStartup Inc.',
      location: 'Remote',
      startDate: 'May 2025',
      endDate: 'Present',
      current: true,
      description: [
        'Optimized API latency by 40% using Redis caching strategies.',
        'Built a real-time notification service using Socket.IO and Node.js.',
        'Collaborated with the frontend team to integrate RESTful APIs.',
      ],
      technologies: ['Node.js', 'Redis', 'AWS', 'MongoDB'],
    },
  ],
  projects: [
    {
      title: 'Lost n Found',
      description:
        'A full-stack platform connecting users to report and recover lost items. Features real-time chat, image uploads, and location-based matching. Built with scalable architecture in mind.',
      techStack: ['MERN Stack', 'Socket.IO', 'Cloudinary', 'Leaflet Maps'],
      links: [
        { name: 'GitHub', url: 'https://github.com/raghavendra1729-cell' },
        { name: 'Live Demo', url: 'https://lost-n-found-demo.com' },
      ],
      featured: true,
      startDate: 'Jan 2025',
      endDate: 'Feb 2025',
    },
    {
      title: 'Multi-threaded HTTP Server',
      description:
        'A custom HTTP server built from scratch in Python using low-level socket programming. Handles concurrent client requests using threading and supports basic HTTP methods (GET, POST).',
      techStack: ['Python', 'Socket Programming', 'Multi-threading', 'Networking'],
      links: [{ name: 'GitHub', url: 'https://github.com/raghavendra1729-cell' }],
      featured: true,
      startDate: 'Nov 2024',
      endDate: 'Dec 2024',
    },
    {
      title: 'Sleep Quality Prediction',
      description:
        'Machine Learning analysis project utilizing classification algorithms to predict sleep quality based on lifestyle factors. Achieved 92% accuracy using Random Forest.',
      techStack: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
      links: [{ name: 'Notebook', url: 'https://github.com/raghavendra1729-cell' }],
      featured: false,
      startDate: 'Oct 2024',
      endDate: 'Nov 2024',
    },
  ],
  cpProfiles: [
    {
      platform: 'LeetCode',
      username: 'raghavendra1729',
      rating: 1750,
      maxRating: 1750,
      rank: 'Knight',
      solvedCount: 700,
      profileUrl: 'https://leetcode.com/u/raghavendra1729',
    },
    {
      platform: 'CodeChef',
      username: 'raghavendra_cc',
      rating: 1680,
      maxRating: 1680,
      rank: '3-Star',
      solvedCount: 200,
      profileUrl: 'https://codechef.com',
    },
    {
      platform: 'Codeforces',
      username: 'raghavendra_cf',
      rating: 1210,
      maxRating: 1210,
      rank: 'Pupil',
      solvedCount: 150,
      profileUrl: 'https://codeforces.com',
    },
  ],
  achievements: [
    {
      title: 'Hackathon Winner - Hostel Hub',
      organization: 'TechWeek 2025',
      date: 'Jan 2026',
      description: 'Ranked 7th out of 150+ teams. Built an inventory management app for hostels.',
      links: [{ name: 'Certificate', url: 'https://example.com/certificate' }],
    },
  ],
};

const seedPayload = seedPayloadSchema.parse(rawSeedPayload);

const REVALIDATE_TAGS = [
  PORTFOLIO_DATA_TAG,
  getCollectionTag('achievement'),
  getCollectionTag('cpprofile'),
  getCollectionTag('education'),
  getCollectionTag('experience'),
  getCollectionTag('project'),
  getCollectionTag('skill'),
] as const;

export async function GET() {
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

    await Promise.all([
      Skill.insertMany(seedPayload.skills),
      Education.insertMany(seedPayload.education),
      Experience.insertMany(seedPayload.experience),
      Project.insertMany(seedPayload.projects),
      CPProfile.insertMany(seedPayload.cpProfiles),
      Achievement.insertMany(seedPayload.achievements),
    ]);

    REVALIDATE_TAGS.forEach((tag) => revalidateTag(tag, 'max'));

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        achievements: seedPayload.achievements.length,
        cpProfiles: seedPayload.cpProfiles.length,
        education: seedPayload.education.length,
        experience: seedPayload.experience.length,
        projects: seedPayload.projects.length,
        skills: seedPayload.skills.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

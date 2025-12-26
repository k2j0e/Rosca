import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Circle, User } from '@/lib/data';

export async function GET() {
    // 1. Define Users
    const users: User[] = [
        {
            id: 'u1', name: 'Alice Admin', phoneNumber: '+15550000001', avatar: 'https://ui-avatars.com/api/?name=Alice+Admin&background=0D8ABC&color=fff', location: 'New York, USA', trustScore: 900,
            memberSince: '2023', badges: ['early-backer', 'guide'], stats: { circlesCompleted: 5, onTimePercentage: 100, supportCount: 12 }, history: []
        },
        {
            id: 'u2', name: 'Bob Builder', phoneNumber: '+15550000002', avatar: 'https://ui-avatars.com/api/?name=Bob+Builder&background=random', location: 'London, UK', trustScore: 850,
            memberSince: '2024', badges: ['consistent'], stats: { circlesCompleted: 2, onTimePercentage: 95, supportCount: 3 }, history: []
        },
        {
            id: 'u3', name: 'Charlie Chef', phoneNumber: '+15550000003', avatar: 'https://ui-avatars.com/api/?name=Charlie+Chef&background=random', location: 'Paris, France', trustScore: 800,
            memberSince: '2024', badges: [], stats: { circlesCompleted: 1, onTimePercentage: 90, supportCount: 1 }, history: []
        },
        // ... (simplified for others to avoid massive file write, or just use 'as any' cast if lazy? No, let's be correct for the first few at least)
        { id: 'u4', name: 'Diana Doc', phoneNumber: '+15550000004', avatar: 'https://ui-avatars.com/api/?name=Diana+Doc&background=random', location: 'Berlin, Germany', trustScore: 880, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u5', name: 'Evan Eng', phoneNumber: '+15550000005', avatar: 'https://ui-avatars.com/api/?name=Evan+Eng&background=random', location: 'Tokyo, Japan', trustScore: 920, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u6', name: 'Fiona Farmer', phoneNumber: '+15550000006', avatar: 'https://ui-avatars.com/api/?name=Fiona+Farmer&background=random', location: 'Sydney, Australia', trustScore: 750, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u7', name: 'George Gamer', phoneNumber: '+15550000007', avatar: 'https://ui-avatars.com/api/?name=George+Gamer&background=random', location: 'Toronto, Canada', trustScore: 810, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u8', name: 'Hannah Host', phoneNumber: '+15550000008', avatar: 'https://ui-avatars.com/api/?name=Hannah+Host&background=random', location: 'Dubai, UAE', trustScore: 860, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u9', name: 'Ian Intern', phoneNumber: '+15550000009', avatar: 'https://ui-avatars.com/api/?name=Ian+Intern&background=random', location: 'Singapore', trustScore: 700, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
        { id: 'u10', name: 'Judy Judge', phoneNumber: '+15550000010', avatar: 'https://ui-avatars.com/api/?name=Judy+Judge&background=random', location: 'Rio, Brazil', trustScore: 950, memberSince: '2023', badges: [], stats: { circlesCompleted: 0, onTimePercentage: 0, supportCount: 0 }, history: [] },
    ];

    // 2. Define Circle
    const circle: Circle = {
        id: 'test-circle-1',
        name: 'Global Nomads Fund',
        category: 'Travel',
        amount: 500,
        frequency: 'monthly',
        duration: 10,
        maxMembers: 10,
        payoutTotal: 5000,
        startDate: new Date().toISOString(),
        description: 'A dedicated savings circle for our dream vacations in 2026!',
        rules: ['Pay on time', 'Respect the order', 'No early withdrawals'],
        coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
        isPrivate: false,
        status: 'active',
        adminId: 'u1',
        members: users.map((u, i) => ({
            userId: u.id,
            name: u.name,
            avatar: u.avatar,
            joinedAt: new Date().toISOString(),
            role: i === 0 ? 'admin' : 'member',
            payoutMonth: i + 1,
            payoutPreference: 'any',
            status: i === 1 ? 'paid' : (i === 2 ? 'late' : 'pending') // Bob paid, Charlie late, others pending
        })),
        events: []
    };

    // 3. Write to Files
    const USERS_PATH = path.join(process.cwd(), 'users.json');
    const DB_PATH = path.join(process.cwd(), 'db.json');
    // Also reset current session to Admin
    const SESSION_PATH = path.join(process.cwd(), 'user.json');

    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    fs.writeFileSync(DB_PATH, JSON.stringify([circle], null, 2));
    fs.writeFileSync(SESSION_PATH, JSON.stringify(users[0], null, 2));

    return NextResponse.json({ success: true, message: 'Database seeded with 10 users and 1 circle.' });
}

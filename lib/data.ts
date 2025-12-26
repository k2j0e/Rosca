import 'server-only';
import fs from 'fs';
import path from 'path';

export type MemberStatus = 'paid' | 'pending' | 'late' | 'requested' | 'paid_pending';
export type CircleCategory = 'Travel' | 'Business' | 'Emergency' | 'Other';

export interface User {
    id: string;
    phoneNumber: string; // Primary identity anchor
    name: string;
    avatar: string;
    location?: string; // City / Region
    bio?: string;
    trustScore: number;
    memberSince: string; // e.g. "2021"
    badges: string[]; // e.g. ['early-backer', 'consistent', 'guide']
    stats: {
        circlesCompleted: number;
        onTimePercentage: number;
        supportCount: number;
    };
    history: {
        id: string;
        type: 'contribution' | 'endorsement' | 'badge';
        title: string;
        subtitle: string;
        timestamp: string;
        meta?: any;
    }[];
}

export interface Member {
    userId: string;
    name: string;
    avatar: string;
    joinedAt: string;
    role: 'admin' | 'member';
    payoutMonth?: number; // 1-indexed
    payoutPreference?: 'early' | 'late' | 'any'; // Added preference
    status: MemberStatus;
}

export interface CircleEvent {
    id: string;
    type: 'payment' | 'join' | 'round_start' | 'info';
    message: string;
    timestamp: string;
    meta?: {
        userId?: string;
        userName?: string;
        userAvatar?: string;
        amount?: number;
    };
}

export interface Circle {
    id: string;
    name: string;
    category: CircleCategory;
    amount: number; // Contribution amount
    frequency: 'weekly' | 'monthly' | 'bi-weekly';
    duration: number; // Number of cycles
    payoutTotal: number;
    startDate: string;
    members: Member[];
    maxMembers: number; // Added maxMembers
    description?: string;
    rules?: string[]; // Added rules
    coverImage?: string; // Added coverImage
    isPrivate: boolean;
    status: 'open' | 'active' | 'completed';
    adminId: string;
    events: CircleEvent[]; // Added activity log
}

const DB_PATH = path.join(process.cwd(), 'db.json');
const USER_DB_PATH = path.join(process.cwd(), 'user.json');
const USERS_REGISTRY_PATH = path.join(process.cwd(), 'users.json');

// Initial Default User (for fallback)
const DEFAULT_USER: User = {
    id: 'u1',
    phoneNumber: '+15550109999',
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAasS-Tm_0L0SFa0loHUoMYYrgYAhVY6aD55T5IzbsW5tY6QKzBpccqQxkDa2UQvXpDcmXhKqnTvip2i8-944CMV65YQqlQegt_yuCR8bgCDTiCWVnCtCBu2rprE8gkgl5O663fgkcJbtR-oANpt1bbRGfiLudMWnzj1y_lPeM5_SGN2ovBXOBH3qUS3wZuVLFW8iAORYRPdCNKsOwut1-soe4EkwaDS8qa-RpFXfI6qjV_Au7mt_0he_V1B-vdlJkVxiO3K_2sDfZO',
    trustScore: 850,
    memberSince: "2021",
    badges: ['early-backer', 'consistent', 'guide'],
    stats: {
        circlesCompleted: 3,
        onTimePercentage: 98,
        supportCount: 8
    },
    history: [
        {
            id: 'h1',
            type: 'contribution',
            title: 'Contribution made',
            subtitle: 'Family Vacation Circle · Week 4',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
        },
        {
            id: 'h2',
            type: 'endorsement',
            title: 'Endorsed by Admin',
            subtitle: 'Verified identity confirmation',
            timestamp: new Date(Date.now() - 7 * 86400000).toISOString() // 1 week ago
        },
        {
            id: 'h3',
            type: 'badge',
            title: "Unlocked 'Guide' Badge",
            subtitle: 'Invited 3 trusted friends',
            timestamp: new Date(Date.now() - 14 * 86400000).toISOString() // 2 weeks ago
        }
    ]
};

// --- User Session Management (Current Logged In User) ---

export function getCurrentUser(): User | null {
    try {
        if (fs.existsSync(USER_DB_PATH)) {
            const data = fs.readFileSync(USER_DB_PATH, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading User Session DB:", error);
    }
    return null; // Return null if not logged in
}

export function updateUser(user: User) {
    try {
        fs.writeFileSync(USER_DB_PATH, JSON.stringify(user, null, 2));
    } catch (error) {
        console.error("Error writing User Session DB:", error);
    }
}

export function deleteUserSession() {
    try {
        if (fs.existsSync(USER_DB_PATH)) {
            fs.unlinkSync(USER_DB_PATH);
        }
    } catch (error) {
        console.error("Error deleting User session:", error);
    }
}

// --- User Registry (All Users) ---

function readUsersRegistry(): User[] {
    try {
        if (fs.existsSync(USERS_REGISTRY_PATH)) {
            const data = fs.readFileSync(USERS_REGISTRY_PATH, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading Users Registry:", error);
    }
    return [];
}

function writeUsersRegistry(users: User[]) {
    try {
        fs.writeFileSync(USERS_REGISTRY_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error writing Users Registry:", error);
    }
}

export function registerUser(user: User) {
    const users = readUsersRegistry();
    // Check if user already exists, update if so, else append
    const existingIndex = users.findIndex(u => u.phoneNumber === user.phoneNumber);
    if (existingIndex !== -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    writeUsersRegistry(users);
}

export function findUserByPhone(phone: string): User | undefined {
    const users = readUsersRegistry();
    // Simple normalization check could go here
    return users.find(u => u.phoneNumber.includes(phone) || phone.includes(u.phoneNumber));
}

// Backward compatibility helper (deprecated, check for null in app)
export const MOCK_USER = getCurrentUser() || DEFAULT_USER;

function readDb(): Circle[] {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        return [];
    }
}

function writeDb(circles: Circle[]) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(circles, null, 2));
    } catch (error) {
        console.error("Error writing DB:", error);
    }
}

// Simple In-Memory Store Helpers
export function getCircles() {
    return readDb();
}

export function getCircle(id: string) {
    const circles = readDb();
    return circles.find(c => c.id === id);
}

export function createCircle(data: Partial<Circle>, creator: User) {
    const circles = readDb();
    const newCircle: Circle = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'New Circle',
        category: data.category || 'Other',
        amount: data.amount || 0,
        frequency: data.frequency || 'monthly',
        duration: data.duration || 10,
        maxMembers: data.maxMembers || data.duration || 10, // Default to duration or 10
        payoutTotal: (data.amount || 0) * (data.duration || 10),
        startDate: new Date().toISOString().split('T')[0],
        description: data.description || '',
        rules: data.rules || [],
        coverImage: data.coverImage || '',
        isPrivate: data.isPrivate || false,
        status: 'open',
        adminId: creator.id,
        members: [{
            userId: creator.id,
            name: creator.name,
            avatar: creator.avatar,
            joinedAt: new Date().toISOString(),
            role: 'admin',
            status: 'pending'
        }],
        events: [{
            id: Math.random().toString(36).substr(2, 9),
            type: 'info',
            message: 'Circle created',
            timestamp: new Date().toISOString()
        }]
    };
    circles.unshift(newCircle); // Add to top
    writeDb(circles);
    return newCircle;
}

export function joinCircle(circleId: string, user: User, preference: 'early' | 'late' | 'any' = 'any') {
    const circles = readDb();
    const circleIndex = circles.findIndex(c => c.id === circleId);

    if (circleIndex !== -1) {
        const circle = circles[circleIndex];
        const exists = circle.members.find(m => m.userId === user.id);
        if (!exists) {
            circle.members.push({
                userId: user.id,
                name: user.name,
                avatar: user.avatar,
                joinedAt: new Date().toISOString(),
                role: 'member',
                payoutPreference: preference,
                status: 'requested'
            });
            writeDb(circles);
        }
    }
}

export function updateCircleMembers(circleId: string, members: Member[]) {
    const circles = readDb();
    const circleIndex = circles.findIndex(c => c.id === circleId);

    if (circleIndex !== -1) {
        circles[circleIndex].members = members;
        writeDb(circles);
    }
}

export function updateMemberStatus(circleId: string, userId: string, newStatus: 'approved' | 'rejected' | MemberStatus) {
    const circles = readDb();
    const circleIndex = circles.findIndex(c => c.id === circleId);

    if (circleIndex !== -1) {
        let members = circles[circleIndex].members;
        const memberIndex = members.findIndex(m => m.userId === userId);

        if (memberIndex !== -1) {
            if (newStatus === 'rejected') {
                // Remove member
                members = members.filter(m => m.userId !== userId);
            } else {
                // Update status
                members[memberIndex].status = newStatus as MemberStatus;

                if (newStatus === 'pending') { // Was approved (mapped from 'approved')
                    // Check if we can log here. We need to call addCircleEvent.
                    // But we are inside updateMemberStatus.
                    // Let's just do it inline or call the helper after?
                    // Helper reads DB again. Inefficient. 
                    // But strictly speaking, for MVP it's fine.
                    // Better: modify the circle object in memory here if we can.
                    // Actually layout logic:
                    // We writeDb at the end.
                    // Let's just modify the events array here.

                    if (!circles[circleIndex].events) circles[circleIndex].events = [];

                    circles[circleIndex].events.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'join',
                        message: `${members[memberIndex].name} joined the circle`,
                        timestamp: new Date().toISOString(),
                        meta: {
                            userId: members[memberIndex].userId,
                            userName: members[memberIndex].name,
                            userAvatar: members[memberIndex].avatar
                        }
                    });
                }
            }
        }
        circles[circleIndex].members = members;
        writeDb(circles);
    }
}


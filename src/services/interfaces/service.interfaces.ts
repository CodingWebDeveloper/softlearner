import { Category, User } from "@/lib/database/database";

export interface BasicCourse {
    id: string;
    name: string;
    description?: string;
    video_url?: string;
    price: number;
    thumbnail_image_url?: string;
    creator?: User;
    category?: Category;
    created_at: string;
    updated_at: string;
}


export interface GetCoursesParams {
    page: number;
    pageSize: number;
    search?: string;
    category?: string;
    tags?: string[];
}

export interface GetCoursesResult {
    courses: BasicCourse[];
    totalRecord: number;
}

export interface BasicSection {
    id: string;
    course_id: string;
    name: string;
    order_index?: number;
    created_at: string;
    updated_at: string;
}
export interface Post {
    approval: number,
    createdDate: string,
    file: string,
    image: string,
    modifiedDate: string,
    postId: number,
    status: string,
    text: string,
    userId: number
    alumniName: string,
};

export interface Comment {
    commentId: number,
    createdDate: string,
    modifiedDate: string,
    status: number,
    text: string,
    userId: number,
    userName: string,
    userProfile: string
}

export interface NestedPost {
    approval: number,
    createdDate: string,
    file: string,
    image: string,
    modifiedDate: string,
    postId: number,
    status: string,
    text: string,
    userId: number,
    comment: Comment[]
}

export const EMPTY_POST = {
    approval: 0,
    createdDate: '',
    file: '',
    image: '',
    modifiedDate: '',
    postId: 0,
    status: '',
    text: '',
    userId: 0,
    comment: []
};

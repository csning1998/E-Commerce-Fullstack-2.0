interface User {
    userId: string;
}

interface AuthenticatedRequest {
    currentUser: User;
}

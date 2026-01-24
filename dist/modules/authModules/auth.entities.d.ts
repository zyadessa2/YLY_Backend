export interface ILoginResponse {
    credentials: {
        accessToken: string;
        refreshToken: string;
    };
    user: {
        _id: string;
        email: string;
        role: string;
        governorateId?: {
            _id: string;
            name: string;
            arabicName: string;
            slug: string;
            logo?: string;
            coverImage?: string;
        };
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
export interface IRefreshResponse {
    accessToken: string;
}
//# sourceMappingURL=auth.entities.d.ts.map
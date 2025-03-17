interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export const successResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message: string = 'Error', data?: any): ApiResponse<any> => ({
    success: false,
    message,
    data,
});

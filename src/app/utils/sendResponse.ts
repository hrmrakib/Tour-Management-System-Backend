
type TServeResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
        total: number;
    },
    data: T
}
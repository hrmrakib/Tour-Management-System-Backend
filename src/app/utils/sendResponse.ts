type TMeta = {
  total: number;
};

type TServeResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    total: number;
  };
  data: T;
};

export const sendResponse = <T>(res: any, data: TServeResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;

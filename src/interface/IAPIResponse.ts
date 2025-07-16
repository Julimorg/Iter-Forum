export type IResponse<T> = {
    is_success?: boolean,
    status_code?: number,
    message?: string,
    data: T,
    timestamp?: string,
}
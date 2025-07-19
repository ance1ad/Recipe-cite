export class ApiError extends Error{
    constructor (status, message){
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message){
        return new ApiError(404, message);
    }

    static internal(message){
        return new ApiError(500, message);
    }

    // нет доступа
    static forbidden(message){
        return new ApiError(403, message);
    }

}


export class ApiError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details; // Дополнительные детали (например, валидация полей)
    this.timestamp = new Date().toISOString(); // Время возникновения ошибки
  }

  // 400 — Неверный запрос
  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  // 401 — Не авторизован
  static unauthorized(message = 'Требуется авторизация') {
    return new ApiError(401, message);
  }

  // 403 — Доступ запрещен
  static forbidden(message = 'Доступ запрещен') {
    return new ApiError(403, message);
  }

  // 404 — Не найдено
  static notFound(message = 'Ресурс не найден') {
    return new ApiError(404, message);
  }

  // 409 — Конфликт (например, email уже занят)
  static conflict(message, details) {
    return new ApiError(409, message, details);
  }

  // 422 — Ошибка валидации
  static validationError(details) {
    return new ApiError(422, 'Ошибка валидации', details);
  }

  // 500 — Внутренняя ошибка сервера
  static internal(message = 'Внутренняя ошибка сервера') {
    return new ApiError(500, message);
  }
}
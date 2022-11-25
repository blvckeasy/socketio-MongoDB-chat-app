import { pagination } from "../../../config.js";

export function pagination (data = [], page = pagination.page, limit = pagination.limit) {
  try {
    const paginated_data = data.slice(page * limit, (page + 1) * limit);
    return paginated_data;
  } catch (error) {
    throw error;
  }
}

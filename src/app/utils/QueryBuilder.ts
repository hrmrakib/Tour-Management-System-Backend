import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const queryCopy = { ...this.query };

    for (const field of excludeField) {
      delete queryCopy[field];
    }

    this.modelQuery = this.modelQuery.find(queryCopy);

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.search || "";

    if (searchTerm) {
      // TODO: AI suggest code, not module code
      this.modelQuery = this.modelQuery.find({
        $or: [
          ...searchableField.map((field) => ({
            [field]: {
              $regex: searchTerm,
              $options: "i",
            },
          })),
        ],
      });
    }

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",")?.join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  pagination(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const total = await this.modelQuery.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  // TODO: AI suggest code, not module code
  execute(): Query<T[], T> {
    return this.modelQuery;
  }
}

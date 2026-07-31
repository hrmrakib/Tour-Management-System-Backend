import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchableFields } from "./division.constant";
import { Division } from "./division.model";

const createDivision = async (data: any) => {
  const existingDivision = await Division.findOne({ name: data.name });
  if (existingDivision) {
    throw new Error("A division with the same name already exists.");
  }

  const division = await Division.create(data);
  return division;
};

const getAllDivisions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);

  const divisions = await queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .pagination();
};

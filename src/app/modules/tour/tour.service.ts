import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchFields, tourTypeSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new Error("A tour with the same title already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchFields)
    .filter()
    .sort()
    .fields()
    .pagination();

  const [data, meta] = await Promise.all([
    tours.execute(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findById(slug);
  return {
    data: tour,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found");
  }

  const result = await Tour.findByIdAndDelete(id);
  return result;
};

const createTourType = async (payload: ITourType) => {
  const existingTour = await TourType.findOne({ name: payload.name });
  if (existingTour) {
    throw new Error("A tour type with the same name already exists.");
  }

  return await TourType.create({ name: payload.name });
};

const getAllTourTypes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const tourTypes = await queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .pagination();

  const [data, meta] = await Promise.all([
    tourTypes.execute(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleTourType = async (id: string) => {
  const existingTour = await TourType.findById(id);
  if (!existingTour) {
    throw new Error("Tour type not found");
  }

  return {
    data: existingTour,
  };
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTour = await TourType.findById(id);
  if (!existingTour) {
    throw new Error("Tour type not found");
  }

  return await TourType.findByIdAndUpdate(id, payload, { new: true });
};

const deleteTourType = async (id: string) => {
  const existingTour = await TourType.findById(id);
  if (!existingTour) {
    throw new Error("Tour type not found");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourServices = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,

  createTourType,
  getAllTourTypes,
  getSingleTourType,
  updateTourType,
  deleteTourType,
};

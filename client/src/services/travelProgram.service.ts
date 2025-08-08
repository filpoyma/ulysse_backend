import travelProgramApi from '../api/travelProgram.api.ts';
import { travelProgramActions } from '../store/reducers/travelProgram';
import { store } from '../store';
import { IFirstPageData, IFourthDayData } from '../types/travelProgram.types.ts';

export const travelProgramService = {
  async getAll() {
    const resp = await travelProgramApi.getAll();
    if (resp?.data) store.dispatch(travelProgramActions.setPrograms(resp.data));
  },
  async createTemplate(name: string) {
    const resp = await travelProgramApi.createTemplate(name);
    if (resp?.data) store.dispatch(travelProgramActions.addProgram(resp.data));
  },
  async getById(id: string) {
    const res = await travelProgramApi.getById(id);
    if (res?.data) store.dispatch(travelProgramActions.setProgram(res.data));
  },
  async getByName(name: string) {
    const res = await travelProgramApi.getByName(name);
    if (res?.data) store.dispatch(travelProgramActions.setProgram(res.data));
  },
  async delete(id: string) {
    await travelProgramApi.delete(id);
    store.dispatch(travelProgramActions.removeProgram(id));
  },
  async updateFirstPage(programName: string, data: IFirstPageData) {
    const res = await travelProgramApi.updateFirstPage(programName, data);
    if (res?.data) {
      store.dispatch(travelProgramActions.updateProgram({ firstPage: res.data }));
    }
  },
  async updateReviewDay(
    programId: string,
    dayIndex: number,
    data: {
      day?: Date;
      numOfDay: string;
      activity?: {
        icon: string;
        dayActivity: {
          line1: string;
          line2?: string;
          line3?: string;
          isFlight: boolean;
          more?: string;
        };
      }[];
    },
  ) {
    const res = await travelProgramApi.updateReviewDay(programId, dayIndex, data);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        const updatedReview = [...program.secondPageTables.routeDetailsTable.review];
        updatedReview[dayIndex] = res.data;
        store.dispatch(
          travelProgramActions.updateProgram({
            secondPageTables: {
              ...program.secondPageTables,
              routeDetailsTable: {
                ...program.secondPageTables.routeDetailsTable,
                review: updatedReview,
              },
            },
          }),
        );
      }
    }
  },
  async deleteReviewDay(programId: string, dayIndex: number) {
    const res = await travelProgramApi.deleteReviewDay(programId, dayIndex);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        store.dispatch(
          travelProgramActions.updateProgram({
            secondPageTables: {
              ...program.secondPageTables,
              routeDetailsTable: {
                ...program.secondPageTables.routeDetailsTable,
                review: res.data,
              },
            },
          }),
        );
      }
    }
  },
  async reorderReviewDays(programId: string, fromIndex: number, toIndex: number) {
    const res = await travelProgramApi.reorderReviewDays(programId, fromIndex, toIndex);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        store.dispatch(
          travelProgramActions.updateProgram({
            secondPageTables: {
              ...program.secondPageTables,
              routeDetailsTable: {
                ...program.secondPageTables.routeDetailsTable,
                review: res.data,
              },
            },
          }),
        );
      }
    }
  },
  async updateAccommodationRow(
    programId: string,
    rowIndex: number,
    data: {
      period: string;
      hotelName: string;
      details: string;
      numOfNights: number;
    },
  ) {
    const res = await travelProgramApi.updateAccommodationRow(programId, rowIndex, data);
    if (res) {
      const program = store.getState().travelProgram.program;
      if (program) {
        const updatedAccommodation = [...program.secondPageTables.accommodation];
        updatedAccommodation[rowIndex] = res.data;
        store.dispatch(
          travelProgramActions.updateProgram({
            secondPageTables: {
              ...program.secondPageTables,
              accommodation: updatedAccommodation,
            },
          }),
        );
      }
    }
  },
  async deleteAccommodationRow(programId: string, rowIndex: number) {
    const res = await travelProgramApi.deleteAccommodationRow(programId, rowIndex);
    if (res) {
      const program = store.getState().travelProgram.program;
      if (program) {
        const updatedAccommodation = [...program.secondPageTables.accommodation];
        updatedAccommodation.splice(rowIndex, 1);
        store.dispatch(
          travelProgramActions.updateProgram({
            secondPageTables: {
              ...program.secondPageTables,
              accommodation: updatedAccommodation,
            },
          }),
        );
      }
    }
  },
  async addToGallery(programId: string, imageIds: string[]) {
    const res = await travelProgramApi.addToGallery(programId, imageIds);
    console.log(res.data);
    if (res?.data) {
      store.dispatch(travelProgramActions.updateProgram({ fourthPageDay: res.data.fourthPageDay }));
    }
    return res;
  },

  async updateGallery(programId: string, imageIds: string[]) {
    const res = await travelProgramApi.updateGallery(programId, imageIds);
    console.log(res.data);
    if (res?.data) {
      store.dispatch(travelProgramActions.updateProgram({ fourthPageDay: res.data.fourthPageDay }));
    }
    return res;
  },

  async updateDaySection(programId: string, dayIndex: number, data: IFourthDayData) {
    const res = await travelProgramApi.updateDaySection(programId, dayIndex, data);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        const updatedDaysData = [...program.fourthPageDay.daysData];
        updatedDaysData[dayIndex] = res.data;
        store.dispatch(
          travelProgramActions.updateProgram({
            fourthPageDay: {
              ...program.fourthPageDay,
              daysData: updatedDaysData,
            },
          }),
        );
      }
    }
  },

  async addDaySection(programId: string, data: IFourthDayData) {
    const res = await travelProgramApi.addDaySection(programId, data);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        const updatedDaysData = [...program.fourthPageDay.daysData, res.data];
        store.dispatch(
          travelProgramActions.updateProgram({
            fourthPageDay: {
              ...program.fourthPageDay,
              daysData: updatedDaysData,
            },
          }),
        );
      }
    }
  },

  async deleteDaySection(programId: string, dayIndex: number) {
    const res = await travelProgramApi.deleteDaySection(programId, dayIndex);
    if (res?.data) {
      const program = store.getState().travelProgram.program;
      if (program) {
        store.dispatch(
          travelProgramActions.updateProgram({
            fourthPageDay: {
              ...program.fourthPageDay,
              daysData: res.data,
            },
          }),
        );
      }
    }
  },
};

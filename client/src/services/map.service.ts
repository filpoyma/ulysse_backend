import mapApi from '../api/map.api';
import { ILogistics } from '../types/travelProgram.types';
import { store } from '../store';
import { travelProgramActions } from '../store/reducers/travelProgram';

export const mapService = {
  async updateLogistics(programId: string, logistics: ILogistics[]) {
    const res = await mapApi.updateLogistics(programId, logistics);
    if (res.success) {
      const program = store.getState().travelProgram.program;
      if (program) {
        store.dispatch(
          travelProgramActions.updateProgram({
            thirdPageMap: {
              ...program.thirdPageMap,
              logistics: res.data,
            },
          }),
        );
      }
    }
    return res;
  },
};

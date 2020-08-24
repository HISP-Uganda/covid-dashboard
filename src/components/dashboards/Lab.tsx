import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";
import { Visualization } from "../../models/Visualization";
import { DashboardItem } from "./Dashboard";

export const Lab = observer(() => {
  const store = useStore();

  const black = { className: 'white', labelClassName: 'indicator-label' };
  const redDark = { className: 'red-dark', labelClassName: 'indicator-label' };
  const redDarkProgress = { strokeColor: '#ff5b5c', trailColor: '#fffbe9', textColor: '#f1f7fb' }


  const beds = new Visualization();
  beds.setData({ rows: [] });
  beds.setDx([
    { dx: 'imTyJFtNY0v', label: 'Number of samples Received by Lab' },
    { dx: 'dCHWPc5O0hy', label: 'Number of tests conducted', className: 'red' },
    { dx: 'oK76O9uCtEe', label: 'Admissions', className: 'red' },
    { dx: 'v9r6qu7MAvk', chart: 'circle', otherText: 'Occupancy' }
  ]);
  beds.setPeriods(['THIS_YEAR']);
  beds.setType('textValues');

  useEffect(() => {
    if (!store.isLight) {
      beds.changeDxClass({
        'imTyJFtNY0v': black,
        'dCHWPc5O0hy': black,
        'oK76O9uCtEe': redDark,
        'v9r6qu7MAvk': redDarkProgress,
      });

    }
  }, [store.isLight, beds, black, redDark, redDarkProgress]);

  return <div className={`dashboard1 h-full`}>
    {/* <div className="grid grid-rows-1 grid-cols-8 gap-1 flex-col">
    </div> */}
      <DashboardItem element={beds} title="Admissions and Bed Occupancy" className="row-span-1 col-span-2" childClass="flex justify-around text-center" />
  </div>;
});

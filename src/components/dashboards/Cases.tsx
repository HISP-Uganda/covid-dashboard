import dayjs from 'dayjs';
import { observer } from "mobx-react";
import React, { FC, useEffect } from "react";
import useDimensions from "react-use-dimensions";
import { useStore } from '../../Context';
import { TItem, Visualization } from '../../models/Visualization';
import { Chart } from "../visualizations/Chart";
import { Map } from "../visualizations/Map";
import { SingleValues } from "../visualizations/SingleValues";
import { Tabular } from '../visualizations/Tabular';

interface DashboardItemProps {
  title: string;
  element: TItem;
  other?: TItem;
  className?: string;
  otherIsMain?: boolean;
  childClass?: string;
}

interface ItemProps {
  element: TItem;
}

export const Item: FC<ItemProps> = ({ element }) => {
  switch (element.type) {
    case "chart":
      if (element.chartType === "map") {
        return <Map element={element} />;
      }
      return <Chart element={element} />;
    case "multiple":
      return <Chart element={element} />;
    case "table":
      return <Tabular element={element} />
    case "plainText":
      return element.data;
    case "textValues":
      return <SingleValues element={element} />;
  }
}
export const DashboardItem: FC<DashboardItemProps> = observer(({ element, title, other, className = '', childClass = "", otherIsMain = false }) => {
  const [c1, d1] = useDimensions({ liveMeasure: false });
  if (other && otherIsMain) {
    other.setDimension(d1.width - 150, d1.height - 38)
  } else if (other && !otherIsMain) {
    element.setDimension(d1.width - 150, d1.height - 38);
  } else {
    element.setDimension(d1.width, d1.height - 38);
  }
  const store = useStore();
  return <div ref={c1} className={className + ' ' + store.currentBackgrounds.cardBG}>
    <div className={store.currentBackgrounds.header}>
      <span>{title}</span>
    </div>

    {!!other ? otherIsMain ? <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr' }}>
      <div className="flex flex-col justify-around items-center">
        <Item element={element} />
      </div>
      <Item element={other} />
    </div> : <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px' }}>
        <Item element={element} />
        <div className="flex flex-col justify-around items-center">
          <Item element={other} />
        </div>
      </div> : <div className={childClass} style={{ height: element.height ? element.height : '' }}>
        <Item element={element} />
      </div>}
  </div>

})

export const enumerateDates = (startDate: string) => {
  const start = dayjs(startDate).toDate();
  const lastDate = dayjs().toDate();

  const year = start.getFullYear();
  const month = start.getMonth();
  let day = start.getDate();
  const dates: Date[] = [start];

  while (dates[dates.length - 1] < lastDate) {
    dates.push(new Date(year, month, day++));
  }
  return dates.map((d: Date) => {
    return dayjs(d).format('YYYYMMDD')
  });
};

export const Case = observer(() => {
  const store = useStore();

  const black = { className: 'white', labelClassName: 'indicator-label' };
  const redDark = { className: 'red-dark', labelClassName: 'indicator-label' };

  const greenDarkProgress = { strokeColor: '#20C997', trailColor: '#fffbe9', textColor: '#f1f7fb' };

  const redDarkProgress = { strokeColor: '#ff5b5c', trailColor: '#fffbe9', textColor: '#f1f7fb' }

  const beds = new Visualization();
  beds.setData({ rows: [] });
  beds.setD2(store.d2);
  beds.setDx([
    { dx: 'QTLv7jKT6tU', label: 'Bed Capacity' },
    { dx: 'THaNba5GyJj', label: 'Beds Available', className: 'red' },
    { dx: 'ghBNilqMiXq', label: 'Active Admissions', className: 'red' },
    { dx: 'v9r6qu7MAvk', chart: 'circle', otherText: 'Occupancy' }
  ]);
  beds.setPeriods(['TODAY']);
  beds.setType('textValues');

  const tableData = new Visualization();
  tableData.setData({ rows: [] });
  tableData.setD2(store.d2);

  tableData.setMultipleAnalysis([
    {
      dx: [
        { dx: 'J5Eh3xsW1fz', label: 'Cumulative Admissions' },
        { dx: 'oK76O9uCtEe', label: 'Active Admissions' },
        { dx: 'JlxdA5zFYSc', label: 'Cumulative Recoveries' },
        { dx: 't0M20fJS6gE', label: 'Cumulative deaths' },
      ],
    }
  ])

  tableData.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  tableData.setFilterByDx(false);
  tableData.setFilterByOus(false);
  tableData.setPeriods(['THIS_YEAR']);
  tableData.setType('table');
  tableData.setCanViewProgram(store.canSeeViewButton)

  const testingAndContactTracing = new Visualization();
  testingAndContactTracing.setData({ rows: [] });
  testingAndContactTracing.setD2(store.d2);
  testingAndContactTracing.setDx([
    { dx: 'ubBVfdXXgWn', className: 'text-red-400 text-xl', label: 'Tested Positive', labelClassName: 'text-lg' },
    {
      dx: 'J5Eh3xsW1fz', label: 'Cumulative Admissions', child: {
        dx: 'DzhnGXSpxe5',
        chart: 'line'
      }
    },
    {
      dx: 'sVPjmX4NMFg', label: 'Total Recoveries', child: {
        dx: 'IQVcBqOxq7M',
        chart: 'line'
      }
    },
    {
      dx: 'bb6T8Nf4Ear', label: 'Total Deaths', child: {
        dx: 'kAMAi9ukzKF',
        chart: 'line'
      }
    },
  ]);
  testingAndContactTracing.setPeriods(['TODAY']);
  testingAndContactTracing.setType('textValues');

  const admissions = new Visualization();
  admissions.setData({ rows: [] });
  admissions.setD2(store.d2);
  admissions.setDx([
    { dx: 'C3a2t1kIppc', label: 'Beds' },
    { dx: 'oK76O9uCtEe', label: 'Active Admissions' },
  ]);
  admissions.setPeriods(['THIS_YEAR']);
  admissions.setType('chart');
  admissions.setChartType('column');
  admissions.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  admissions.setFilterByDx(false);
  admissions.setFilterByOus(false);
  admissions.setFilterByPeriods(true);

  useEffect(() => {
    if (!store.isLight) {
      beds.changeDxClass({
        'QTLv7jKT6tU': black,
        'THaNba5GyJj': black,
        'ghBNilqMiXq': black,
        'v9r6qu7MAvk': redDarkProgress,
      });
      testingAndContactTracing.changeDxClass({
        'CemgWPzdnUf': black,
        'ubBVfdXXgWn': { ...redDark },
        'LBcQjKkPukY': black,
        'rjlTjyYSr0d': { ...black },
        'yK5LBdQeS5V': { ...redDark },
        'tZ2Tfp9HjwG': redDarkProgress,
        'sVPjmX4NMFg': { ...black, child: greenDarkProgress },
        'bb6T8Nf4Ear': { ...redDark, child: redDarkProgress },
        'J5Eh3xsW1fz': { ...black, child: redDarkProgress }
      });
    } else {
    }
  }, [
    store.isLight,
    testingAndContactTracing,
    beds,
    black,
    greenDarkProgress,
    redDark,
    redDarkProgress,
  ])

  return (
    <div className={`dashboard2`}>
      <div className="grid grid-rows-1 grid-cols-6 gap-1 flex-col">
        <DashboardItem element={testingAndContactTracing} className="row-span-1 col-span-4" title="Testing and Contact Tracing" childClass="flex justify-around text-center" />
        <DashboardItem element={beds} title="Admissions and Bed Occupancy" className="row-span-1 col-span-2" childClass="flex justify-around text-center" />
      </div>
      <div className="grid grid-rows- grid-cols-1">
        <DashboardItem element={admissions} title="Currently admitted suspect or probable cases today by CTU" className="row-span-1 col-span-1" />
      </div>

      <div className="grid grid-rows-1 grid-cols-1">
        <DashboardItem element={tableData} title="Currently admitted suspect or probable cases today by CTU" className="row-span-1 col-span-1" />
      </div>
    </div>
  );
});

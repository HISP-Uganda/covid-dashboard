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
    { dx: 'ghBNilqMiXq', label: 'Active Admissions' },
    { dx: 'sVPjmX4NMFg', label: 'Recoveries' },
    { dx: 'bb6T8Nf4Ear', label: 'Total Deaths' },
  ]);
  testingAndContactTracing.setPeriods(['TODAY']);
  testingAndContactTracing.setType('textValues');

  const deaths = new Visualization();
  deaths.setData({ rows: [] });
  deaths.setD2(store.d2);
  deaths.setDx([
    { dx: 'sVPjmX4NMFg', label: 'Recoveries' },
    { dx: 'bb6T8Nf4Ear', label: 'Total Deaths' },
    { dx: 'ob2qpzPpniN', label: 'Fatality Rates', otherText: '%' },
  ]);
  deaths.setPeriods(['TODAY']);
  deaths.setType('textValues');
  const newCasesAdmitted = new Visualization();
  newCasesAdmitted.setData({ rows: [] });
  newCasesAdmitted.setD2(store.d2)
  newCasesAdmitted.setDx([
    { dx: 'BVRRNsSF7nF', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmitted.setPeriods(['THIS_YEAR']);
  newCasesAdmitted.setType('chart');
  newCasesAdmitted.setChartType('column');
  newCasesAdmitted.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  newCasesAdmitted.setOtherDimension({ 'jU8ItIkJNRB': [{ dx: 'lH368QiA6zT', name: 'Male' }, { dx: 'Kv6jIE8nFZr', name: 'Female' }] })
  newCasesAdmitted.setFilterByDx(true);
  newCasesAdmitted.setFilterByOus(false);
  newCasesAdmitted.setFilterByPeriods(true);

  const newCasesAdmittedByAge = new Visualization();
  newCasesAdmittedByAge.setData({ rows: [] });
  newCasesAdmittedByAge.setD2(store.d2)
  newCasesAdmittedByAge.setDx([
    { dx: 'BVRRNsSF7nF', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmittedByAge.setPeriods(['THIS_YEAR']);
  newCasesAdmittedByAge.setType('chart');
  newCasesAdmittedByAge.setChartType('column');
  newCasesAdmittedByAge.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  newCasesAdmittedByAge.setOtherDimension({
    'twwLRACvyrK': [
      { dx: 'WdjXiHgMPNe', name: '0-4yrs', color: '#f35588' },
      { dx: 'MtSJfuS9PFb', name: '5-19yrs', color: '#05dfd7' },
      { dx: 'CZOkF3lo3eK', name: '20-49yrs', color: '#a3f7bf' },
      { dx: 'j0TofCZFZLs', name: '50+', color: '#fff591' },
      { dx: 'FWN5AIvxnAw', name: 'Unknown', color: '#0f4c75' },
    ]
  })
  newCasesAdmittedByAge.setFilterByDx(true);
  newCasesAdmittedByAge.setFilterByOus(false);
  newCasesAdmittedByAge.setFilterByPeriods(true);

  const newCasesAdmittedLast14Days = new Visualization();
  newCasesAdmittedLast14Days.setData({ rows: [] });
  newCasesAdmittedLast14Days.setD2(store.d2)
  newCasesAdmittedLast14Days.setDx([
    { dx: 'BVRRNsSF7nF', label: 'New Cases admitted in last 14 days' }
  ]);
  newCasesAdmittedLast14Days.setPeriods(['LAST_14_DAYS']);
  newCasesAdmittedLast14Days.setType('chart');
  newCasesAdmittedLast14Days.setChartType('line');
  newCasesAdmittedLast14Days.setFilterByDx(false);
  newCasesAdmittedLast14Days.setFilterByOus(true);
  newCasesAdmittedLast14Days.setFilterByPeriods(false);

  const newCasesAdmittedConfirmed = new Visualization();
  newCasesAdmittedConfirmed.setData({ rows: [] });
  newCasesAdmittedConfirmed.setD2(store.d2)
  newCasesAdmittedConfirmed.setDx([
    { dx: 'lY3zO9cXGuB', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmittedConfirmed.setPeriods(['THIS_YEAR']);
  newCasesAdmittedConfirmed.setType('chart');
  newCasesAdmittedConfirmed.setChartType('column');
  newCasesAdmittedConfirmed.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  newCasesAdmittedConfirmed.setOtherDimension({ 'jU8ItIkJNRB': [{ dx: 'lH368QiA6zT', name: 'Male' }, { dx: 'Kv6jIE8nFZr', name: 'Female' }] })
  newCasesAdmittedConfirmed.setFilterByDx(true);
  newCasesAdmittedConfirmed.setFilterByOus(false);
  newCasesAdmittedConfirmed.setFilterByPeriods(true);

  const newCasesAdmittedConfirmedByAge = new Visualization();
  newCasesAdmittedConfirmedByAge.setData({ rows: [] });
  newCasesAdmittedConfirmedByAge.setD2(store.d2)
  newCasesAdmittedConfirmedByAge.setDx([
    { dx: 'lY3zO9cXGuB', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmittedConfirmedByAge.setPeriods(['THIS_YEAR']);
  newCasesAdmittedConfirmedByAge.setType('chart');
  newCasesAdmittedConfirmedByAge.setChartType('column');
  newCasesAdmittedConfirmedByAge.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  newCasesAdmittedConfirmedByAge.setOtherDimension({
    'twwLRACvyrK': [
      { dx: 'WdjXiHgMPNe', name: '0-4yrs', color: '#f35588' },
      { dx: 'MtSJfuS9PFb', name: '5-19yrs', color: '#05dfd7' },
      { dx: 'CZOkF3lo3eK', name: '20-49yrs', color: '#a3f7bf' },
      { dx: 'j0TofCZFZLs', name: '50+', color: '#fff591' },
      { dx: 'FWN5AIvxnAw', name: 'Unknown', color: '#0f4c75' },
    ]
  })
  newCasesAdmittedConfirmedByAge.setFilterByDx(true);
  newCasesAdmittedConfirmedByAge.setFilterByOus(true);
  newCasesAdmittedConfirmedByAge.setFilterByPeriods(true);

  const newCasesAdmittedConfirmedByNationality = new Visualization();
  newCasesAdmittedConfirmedByNationality.setData({ rows: [] });
  newCasesAdmittedConfirmedByNationality.setD2(store.d2)
  newCasesAdmittedConfirmedByNationality.setDx([
    { dx: 'lY3zO9cXGuB', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmittedConfirmedByNationality.setPeriods(['THIS_YEAR']);
  newCasesAdmittedConfirmedByNationality.setType('chart');
  newCasesAdmittedConfirmedByNationality.setChartType('column');
  newCasesAdmittedConfirmedByNationality.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  newCasesAdmittedConfirmedByNationality.setOtherDimension({
    'ljsvLDy69V4': [
      { dx: 'rSKvnpvGan1', name: 'National', color: '#f35588' },
      { dx: 'nzeesuOi4Dt', name: 'Refugee', color: '#05dfd7' },
      { dx: 'G9U9xGUZnjj', name: 'Foreign Residents', color: '#a3f7bf' },
      { dx: 'cBzBlkPz6Ny', name: 'Foreign Non-Residents', color: '#fff591' },
    ]
  })
  newCasesAdmittedConfirmedByNationality.setFilterByDx(true);
  newCasesAdmittedConfirmedByNationality.setFilterByOus(true);
  newCasesAdmittedConfirmedByNationality.setFilterByPeriods(true);

  const newCasesAdmittedByCTU = new Visualization();
  newCasesAdmittedByCTU.setData({ rows: [] });
  newCasesAdmittedByCTU.setD2(store.d2);
  newCasesAdmittedByCTU.setOrgUnitGroups(['Ej1BuUrJ9Rm']);

  newCasesAdmittedByCTU.setDx([
    { dx: 'BVRRNsSF7nF', label: 'New Cases admitted yesterday' }
  ]);
  newCasesAdmittedByCTU.setPeriods(['THIS_YEAR']);
  newCasesAdmittedByCTU.setType('chart');
  newCasesAdmittedByCTU.setChartType('column');
  newCasesAdmittedByCTU.setFilterByDx(false);
  newCasesAdmittedByCTU.setFilterByOus(false);
  newCasesAdmittedByCTU.setFilterByPeriods(true);


  const admittedBySeverity = new Visualization();
  admittedBySeverity.setData({ rows: [] });
  admittedBySeverity.setD2(store.d2)
  admittedBySeverity.setDx([
    { dx: 'lY3zO9cXGuB', label: 'New Cases admitted yesterday' }
  ]);
  admittedBySeverity.setPeriods(['THIS_YEAR']);
  admittedBySeverity.setType('chart');
  admittedBySeverity.setChartType('pie');
  admittedBySeverity.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  admittedBySeverity.setOtherDimension({
    'ljsvLDy69V4': [
      { dx: 'rSKvnpvGan1', name: 'National', color: '#f35588' },
      { dx: 'nzeesuOi4Dt', name: 'Refugee', color: '#05dfd7' },
      { dx: 'G9U9xGUZnjj', name: 'Foreign Residents', color: '#a3f7bf' },
      { dx: 'cBzBlkPz6Ny', name: 'Foreign Non-Residents', color: '#fff591' },
    ]
  })
  admittedBySeverity.setFilterByDx(true);
  admittedBySeverity.setFilterByOus(true);
  admittedBySeverity.setFilterByPeriods(true);


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
        'sVPjmX4NMFg': black,
        'bb6T8Nf4Ear': { ...redDark },
        'ghBNilqMiXq': { ...black }
      });

      newCasesAdmittedByAge.changeDxClass({
        'BVRRNsSF7nF': null,
        'twwLRACvyrK': null,
      });
    } else {
    }
  }, [
    store.isLight,
    testingAndContactTracing,
    beds,
    deaths,
    black,
    greenDarkProgress,
    redDark,
    redDarkProgress,
    newCasesAdmittedByAge,
    newCasesAdmitted
  ])

  return (
    <div className={`dashboard2`}>
      <div className="grid grid-rows-1 grid-cols-6 gap-1 flex-col">
        <DashboardItem element={testingAndContactTracing} className="row-span-1 col-span-4" title="Testing and Contact Tracing" childClass="flex justify-around text-center" />
        <DashboardItem element={beds} title="Admissions and Bed Occupancy" className="row-span-1 col-span-2" childClass="flex justify-around text-center" />
      </div>
      <div className="grid grid-rows- grid-cols-1">
        <DashboardItem element={admissions} title="Currently admitted suspect or probable cases today by CTU" className="row-span-1 col-span-1" />
        {/* <DashboardItem element={newCasesAdmittedByAge} title="New Cases admitted yesterday by age group" /> */}
        {/* <DashboardItem element={newCasesAdmittedConfirmedByAge} title="Currently admitted confirmed cases today by Age group" /> */}
        {/* <DashboardItem element={newCasesAdmittedConfirmedByNationality} title="Currently admitted confirmed cases today by Nationlity Status" /> */}
        {/* <DashboardItem element={newCasesAdmittedByCTU} title="Currently admitted suspect or probable cases today by CTU" /> */}
        {/* <DashboardItem element={admittedBySeverity} title="Currently admitted suspect or probable cases today by CTU" /> */}
        {/* <div className="row-span-2 col-span-1"> */}
        {/* <DashboardItem element={newCasesAdmittedByAge} title="New Cases admitted yesterday by age group" /> */}
        {/* <DashboardItem element={newCasesAdmittedLast14Days} title="New Cases admitted last 14 days" /> */}
        {/* <DashboardItem element={newCasesAdmittedConfirmed} title="Currently admitted confirmed cases today by CTU and Sex" /> */}
        {/* </div> */}
      </div>

      <div className="grid grid-rows-1 grid-cols-1">
        <DashboardItem element={tableData} title="Currently admitted suspect or probable cases today by CTU" className="row-span-1 col-span-1" />
      </div>
    </div>
  );
});

// import { Select } from "antd";
import dayjs from 'dayjs';
import { observer } from "mobx-react";
import React, { useEffect, FC } from "react";
import { useStore } from '../../Context';
import { Visualization, TItem } from '../../models/Visualization';
import { Chart } from "../visualizations/Chart";
import { Map } from "../visualizations/Map";
import { SingleValues } from "../visualizations/SingleValues";
import { TVValues } from "../visualizations/TVValues";
import useDimensions from "react-use-dimensions";
import hispLogo from '../../images/logo.png'
import whoLogo from '../../images/h-logo-blue.svg'

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

const Item: FC<ItemProps> = ({ element }) => {
  switch (element.type) {
    case "chart":
      if (element.chartType === "map") {
        return <Map element={element} />;
      }
      return <Chart element={element} />;
    case "multiple":
      return <Chart element={element} />;
    case "plainText":
      return element.data;
    case "textValues":
      return <SingleValues element={element} />;
  }
}
// const { Option } = Select;
const DashboardItem: FC<DashboardItemProps> = observer(({ element, title, other, className = '', childClass = "", otherIsMain = false }) => {
  const [c1, d1] = useDimensions({ liveMeasure: true });
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

    {!!other ? otherIsMain ? <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
      <div className="flex flex-col justify-around items-center">
        <Item element={element} />
      </div>
      <Item element={other} />
    </div> : <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px' }}>
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

export const Dashboard = observer(() => {
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
    { dx: 'oK76O9uCtEe', label: 'Admissions', className: 'red' },
    { dx: 'v9r6qu7MAvk', chart: 'circle', otherText: 'Occupancy' }
  ]);
  beds.setPeriods(['THIS_YEAR']);
  beds.setType('textValues');

  const testingAndContactTracing = new Visualization();
  testingAndContactTracing.setData({ rows: [] });
  testingAndContactTracing.setD2(store.d2);
  testingAndContactTracing.setDx([
    { dx: 'CemgWPzdnUf', label: 'Total Tests Done' },
    {
      dx: 'oNWIFSlbOyL', className: 'text-red-400 text-xl', label: 'Tested Positive', labelClassName: 'text-lg', child: {
        dx: 'DhGtpi9ehqp',
        chart: 'line',
        strokeWidth: 8
      }
    },
    { dx: 'AWqQSTtuWGl', label: 'Contacts Identified' },
    {
      dx: 'Aiu4kJtREFN', label: 'Contacts Tested', child: {
        dx: 'kLUxutfrUjZ',
        chart: 'line'
      }
    },
    {
      dx: 'z1cgvbudBq6', className: 'red', label: 'Positive Contacts', child: {
        dx: 'upO9ps9ItXy',
        chart: 'line'
      }
    },
    { dx: 'tZ2Tfp9HjwG', label: 'RO', chart: 'circle', otherText: 'RO', removePercentage: true },

  ]);
  testingAndContactTracing.setPeriods(['THIS_YEAR']);
  testingAndContactTracing.setType('textValues');

  const poes = new Visualization();
  poes.setData({ rows: [] });
  poes.setD2(store.d2);
  poes.setDx([
    { dx: 'eYpIcHdIk5J', label: 'POEs Available' },
    { dx: 'yRY5bpb2sr2', label: 'POEs Activated', otherText: '%' },
    { dx: 'WhVCS645g2q', label: 'POEs Testing' },
  ]);
  poes.setPeriods(['THIS_YEAR']);
  poes.setType('textValues');

  const incidence = new Visualization();
  incidence.setD2(store.d2);
  incidence.setDx([
    { dx: 'Eh4jODrtZBT', label: 'Incidence', color: '#1B3A50' },
  ]);
  incidence.setPeriods(['LAST_14_DAYS']);
  incidence.setType('chart');
  incidence.setChartType('spline');
  incidence.setFilterByPeriods(false);
  // incidence.setDimension(d1.width - 120, d1.height - 50);

  const dailyInfection = new Visualization();
  dailyInfection.setD2(store.d2);
  dailyInfection.setDx([
    { dx: 'VGnmnm4OC47', label: 'Health Workers Tested' },
    { dx: 'mF9tVYK4jEO', label: 'Health Workers Tested Positive' },
  ]);
  dailyInfection.setPeriods(['LAST_14_DAYS']);
  dailyInfection.setFilterByPeriods(false);
  dailyInfection.setType('chart');
  dailyInfection.setChartType('column');
  // dailyInfection.setDimension(d2.width - 200, d2.height - 50)

  const deaths = new Visualization();
  deaths.setD2(store.d2);
  deaths.setData({ rows: [] });

  deaths.setDx([
    { dx: 'jBcRzxuNzGt', label: 'Recoveries' },
    { dx: 'D7y8pwGMsgp', label: 'Total Deaths' },
    { dx: 'ob2qpzPpniN', label: 'Fatality Rates', otherText: '%' },
  ]);
  deaths.setPeriods(['THIS_YEAR']);
  deaths.setType('textValues');

  const heathWorkers = new Visualization();
  heathWorkers.setD2(store.d2);
  heathWorkers.setData({ rows: [] });

  heathWorkers.setDx([
    {
      dx: 'VGnmnm4OC47', label: 'Workers Tested'
    },
    {
      dx: 'mF9tVYK4jEO', className: 'red', label: 'Positive Workers'
    },
    {
      dx: 'omNy6QA0ptE',
      chart: 'circle',
      showInfo: true
    }
  ]);
  heathWorkers.setPeriods(['THIS_YEAR']);
  heathWorkers.setType('textValues');

  const travellers = new Visualization();
  travellers.setData({ rows: [] });
  travellers.setD2(store.d2);
  travellers.setDx([
    // { dx: 'Wt8gxkBiJZ8', label: 'Travellers Registered at POEs' },
    { dx: 'eYpIcHdIk5J', label: 'POEs Available' },
    { dx: 'yRY5bpb2sr2', label: 'POEs Activated', otherText: '%' },
    { dx: 'uKHils0UxEe', label: 'POEs Testing' },
    { dx: 'BM25rsG76xg', label: 'Tested at POEs' },
    { dx: 'wAOwXzZwZhs', label: 'Tested Positive at POEs' },
    { dx: 'Gxkl04U3CNh', label: 'Quarantine Centers' },
    { dx: 'lxZ5cSmC9p1', label: 'Total Quarantined' },
    { dx: 'YOtibrmhr2c', label: 'Quarantined and Tested' },
    { dx: 'udVNN3ErO9q', label: 'Quarantined and Tested Positive' },
    // { dx: 'vpDs2i5Fc4r', label: 'Contacts of Travellers Tested at POEs' },
    // { dx: 'z1cgvbudBq6', label: 'Contacts of Travellers Tested Positive' },
  ]);
  travellers.setPeriods(['THIS_YEAR']);
  travellers.setType('textValues');


  // const quarantine = new Visualization();
  // quarantine.setData({ rows: [] });
  // quarantine.setD2(store.d2);
  // quarantine.setDx([
  //   // { dx: 'Wt8gxkBiJZ8', label: 'quarantine Registered at POEs' },

  //   // { dx: 'wAOwXzZwZhs', label: 'Tested Positive at POEs' },
  //   // { dx: 'vpDs2i5Fc4r', label: 'Contacts of quarantine Tested at POEs' },
  //   // { dx: 'z1cgvbudBq6', label: 'Contacts of quarantine Tested Positive' },
  // ]);
  // quarantine.setPeriods(['THIS_YEAR']);
  // quarantine.setType('textValues');


  const positiveAtPOE = new Visualization();
  positiveAtPOE.setD2(store.d2);
  positiveAtPOE.setDx([
    // { dx: 'BM25rsG76xg', label: 'Travellers Tested at POEs' },
    { dx: 'wAOwXzZwZhs', label: 'Travellers Tested Positive', color: '#7798BF' },
  ]);
  positiveAtPOE.setPeriods(['LAST_14_DAYS']);
  positiveAtPOE.setType('chart');
  positiveAtPOE.setChartType('column');
  // positiveAtPOE.setOrgUnitGroups(['aobWYizg7hR'])
  positiveAtPOE.setFilterByPeriods(false)
  // positiveAtPOE.setDimension(d3.width - 10, d3.height - 500);


  const positiveAtQuarantine = new Visualization();
  positiveAtQuarantine.setD2(store.d2);
  positiveAtQuarantine.setDx([
    // { dx: 'BM25rsG76xg', label: 'Travellers Tested at POEs' },
    { dx: 'udVNN3ErO9q', label: 'Quarantined Tested Positive', color: '#7798BF' },
  ]);
  positiveAtQuarantine.setPeriods(['LAST_14_DAYS']);
  positiveAtQuarantine.setType('chart');
  positiveAtQuarantine.setChartType('column');
  // positiveAtQuarantine.setOrgUnitGroups(['aobWYizg7hR'])
  positiveAtQuarantine.setFilterByPeriods(false)
  // positiveAtQuarantine.setDimension(d3.width - 10, d3.height - 500);

  const caseIncidence = new Visualization();
  caseIncidence.setD2(store.d2);
  caseIncidence.setDx([
    // { dx: 'aikFogLLKgR', label: 'Total Daily Testing Capacity', type: 'column', },
    // { dx: 'W6jbNXRDbEI', label: 'Tested Done Today', type: 'column', },
    { dx: 'oNWIFSlbOyL', label: 'Tested Positive', type: 'column', color: '#96C5FF' },
    { dx: 'oNWIFSlbOyL', label: `7 Day's Averages`, type: 'spline', color: '#E53E3E', movingAverage: true },
    { dx: 'YUdNyrF8iYp', label: 'Cumulative Daily Cases', type: 'spline', yAxis: 1, color: 'orange', lineWidth: 4 },
  ]);
  caseIncidence.setPeriods(enumerateDates('2020-03-22'));
  // caseIncidence.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  caseIncidence.setFilterByPeriods(false);
  caseIncidence.setType('multiple');
  // caseIncidence.setChartType('column');
  // caseIncidence.setDimension(d1.width - 210, d1.height - 50)

  const testingSites = new Visualization();
  testingSites.setD2(store.d2);
  testingSites.setData({ rows: [] });

  testingSites.setDx([
    { dx: 'ELZwQO5nmUS', label: 'Sites Established' },
    {
      dx: 'aikFogLLKgR', label: 'Testing Capacity',
    },
    {
      dx: 'W6jbNXRDbEI', className: 'red', label: 'Tests Today',
      // child: {
      //   dx: 'kLUxutfrUjZ',
      //   chart: 'line',
      //   strokeColor: '#17803A',
      // }
    },
    {
      dx: 'oNWIFSlbOyL', label: 'Positive Today',
    },
  ]);
  testingSites.setPeriods(['YESTERDAY']);
  testingSites.setType('textValues');

  const testingCapacity = new Visualization();
  testingCapacity.setD2(store.d2);
  testingCapacity.setDx([
    { dx: 'aikFogLLKgR', label: 'Total Daily Testing Capacity', type: 'column', color: '#7798BF' },
    { dx: 'W6jbNXRDbEI', label: 'Tested Done Today', type: 'column', },
    { dx: 'oNWIFSlbOyL', label: 'Tested Positive', type: 'column', },
    { dx: 'Eh4jODrtZBT', label: 'Incidence', type: 'spline', yAxis: 1, color: '#90ee7e' },
  ]);
  testingCapacity.setPeriods(['LAST_14_DAYS']);
  testingCapacity.setFilterByPeriods(false);
  testingCapacity.setType('multiple');

  const map = new Visualization();
  map.setD2(store.d2);
  map.setType('chart');
  map.setChartType('map');
  map.setFilterByOus(false);
  map.setDx([
    { dx: 'zslpvuaEqGP', label: 'Total Daily Testing Capacity', color: '#7798BF' },
  ]);
  map.setPeriods(['THIS_YEAR']);


  useEffect(() => {
    if (!store.isLight) {
      beds.changeDxClass({
        'QTLv7jKT6tU': black,
        'THaNba5GyJj': black,
        'oK76O9uCtEe': redDark,
        'v9r6qu7MAvk': redDarkProgress,
      });
      testingAndContactTracing.changeDxClass({
        'CemgWPzdnUf': black,
        'oNWIFSlbOyL': { ...redDark, child: redDarkProgress },
        'AWqQSTtuWGl': black,
        'Aiu4kJtREFN': { ...black, child: greenDarkProgress },
        'z1cgvbudBq6': { ...redDark, child: redDarkProgress },
        'tZ2Tfp9HjwG': redDarkProgress,
      });

      poes.changeDxClass({
        'eYpIcHdIk5J': null,
        'yRY5bpb2sr2': null,
        'WhVCS645g2q': {}
      });
      incidence.changeDxClass({
        'Eh4jODrtZBT': {}
      })
      dailyInfection.changeDxClass({
        'VGnmnm4OC47': null,
        'mF9tVYK4jEO': null,
      })
      deaths.changeDxClass({
        'jBcRzxuNzGt': black,
        'D7y8pwGMsgp': black,
        'ob2qpzPpniN': black,
      });
      heathWorkers.changeDxClass({
        'VGnmnm4OC47': black,
        'mF9tVYK4jEO': redDark,
        'omNy6QA0ptE': redDarkProgress,
      });
      travellers.changeDxClass({
        'eYpIcHdIk5J': black,
        'yRY5bpb2sr2': black,
        'uKHils0UxEe': black,
        'BM25rsG76xg': black,
        'wAOwXzZwZhs': redDark,
      });
      // quarantine.changeDxClass({
      //   'Gxkl04U3CNh': black,
      //   'lxZ5cSmC9p1': black,
      //   'YOtibrmhr2c': black,
      //   'udVNN3ErO9q': redDark,
      //   // 'wAOwXzZwZhs': black,
      // });
      positiveAtPOE.changeDxClass({
        'wAOwXzZwZhs': null,
      });
      positiveAtQuarantine.changeDxClass({
        'wAOwXzZwZhs': null,
      });
      caseIncidence.changeDxClass({
        'oNWIFSlbOyL': null,
        'YUdNyrF8iYp': null,
      });
      testingSites.changeDxClass({
        'ELZwQO5nmUS': black,
        'aikFogLLKgR': black,
        'W6jbNXRDbEI': { ...black },
        'oNWIFSlbOyL': redDark
      });
      testingCapacity.changeDxClass({
        'aikFogLLKgR': null,
        'W6jbNXRDbEI': null,
        'oNWIFSlbOyL': null,
        'Eh4jODrtZBT': null,
      });
      caseIncidence.changeChartBackground('');
    } else {
      caseIncidence.changeChartBackground('#ffffff')
    }
  }, [
    store.isLight,
    testingSites,
    testingAndContactTracing,
    caseIncidence,
    beds,
    deaths,
    heathWorkers,
    travellers,
    black,
    dailyInfection,
    greenDarkProgress,
    incidence,
    poes,
    positiveAtPOE,
    redDark,
    redDarkProgress,
    testingCapacity,
    // quarantine,
    positiveAtQuarantine
  ])

  return (
    <div className={`dashboard1 h-full`}>
      <div className="grid grid-rows-1 grid-cols-6 gap-1 flex-col">
        <DashboardItem element={testingAndContactTracing} className="row-span-1 col-span-4" title="Testing and Contact Tracing" childClass="flex justify-around text-center" />
        <DashboardItem element={beds} title="Admissions and Bed Occupancy" className="row-span-1 col-span-2" childClass="flex justify-around text-center" />
      </div>
      <div className="h-full grid grid-rows-6 md:grid-rows-3 lg:grid-rows-2 lg:grid-cols-6 grid-cols-1 md:grid-cols-2 gap-1">
        <DashboardItem element={caseIncidence} other={deaths} title="Case Incidence" className="row-span-1 col-span-1 lg:col-span-4" />
        <DashboardItem element={map} title="Case Distribution" className="row-span-2 col-span-1 lg:col-span-2" childClass="flex items-center justify-center text-center" />
        <DashboardItem element={testingSites} other={testingCapacity} otherIsMain={true} title="Testing Sites and Capacity" className="row-span-1 col-span-1 lg:col-span-2" />
        <DashboardItem element={dailyInfection} other={heathWorkers} title="Health Worker Infections" className="row-span-1 col-span-1 lg:col-span-2" />
        {/* <DashboardItem element={travellers} title="POE Screening and Testing" className="row-span-1 col-span-1" childClass="flex justify-around text-center flex-col items-center" /> */}
        {/* <DashboardItem element={quarantine} title="Quarantine" className="row-span-1 col-span-1" childClass="flex justify-around text-center flex-col items-center" /> */}
      </div>
      <div className="bg-white flex items-center">
        <img src={whoLogo} style={{ height: 'auto', width: '100%', maxWidth: 160, marginLeft: 10 }} alt="" />
        <TVValues element={travellers} />
        <img src={hispLogo} style={{ height: 'auto', width: '100%', maxWidth: 110, marginLeft: 'auto', marginRight: 10 }} alt="" />
      </div>
    </div>
  );
});

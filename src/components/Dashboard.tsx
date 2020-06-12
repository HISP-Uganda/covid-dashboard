// import { Select } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import useDimensions from "react-use-dimensions";
import { useStore } from "../Context";
import { TItem, Visualization } from "../models/Visualization";
import { Chart } from "./visualizations/Chart";
import { Map } from "./visualizations/Map";
import { SingleValues } from "./visualizations/SingleValues";


const ResponsiveGridLayout = WidthProvider(Responsive);
// const { Option } = Select;


export const Dashboard = observer(() => {
  const store = useStore();
  const [c1, d1] = useDimensions({ liveMeasure: false });
  const [c2, d2] = useDimensions({ liveMeasure: false });
  const [c3, d3] = useDimensions({ liveMeasure: false });
  const [c4, d4] = useDimensions({ liveMeasure: false });

  const [c11, d11] = useDimensions({ liveMeasure: false });
  const [c22, d22] = useDimensions({ liveMeasure: false });
  const [c33, d33] = useDimensions({ liveMeasure: false });

  const display = (element: TItem) => {
    switch (element.type) {
      case "chart":
        if (element.chartType === "map") {
          return <Map element={element} />;
        }
        return <Chart element={element} />;
      case "plainText":
        return element.data;

      case "textValues":
        return <SingleValues element={element} />;
    }
  };

  const beds = new Visualization();
  beds.setData({ rows: [] });
  beds.setD2(store.d2);
  beds.setDx([
    { dx: 'QTLv7jKT6tU', label: 'Bed Capacity' },
    { dx: 'THaNba5GyJj', label: 'Beds Available', className: 'red' },
    { dx: 'oK76O9uCtEe', label: 'Admissions', className: 'red' },
    { dx: 'v9r6qu7MAvk', chart: 'circle', showInfo: true, strokeWidth: 5 }
  ]);
  beds.setPeriods(['THIS_YEAR']);
  beds.setFilterByOus(true);
  beds.setFilterByPeriods(true);
  beds.setType('textValues');

  const testingAndContactTracing = new Visualization();
  testingAndContactTracing.setData({ rows: [] });
  testingAndContactTracing.setD2(store.d2);
  testingAndContactTracing.setDx([
    { dx: 'UmgcTyhsroc', label: 'Total Tests Done' },
    {
      dx: 'wAOwXzZwZhs', className: 'red', label: 'Tested Positive', child: {
        dx: 'DhGtpi9ehqp',
        chart: 'line'
      }
    },
    { dx: 'a7trfqwqfDR', label: 'Contacts Identified' },
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
    }
  ]);
  testingAndContactTracing.setPeriods(['THIS_YEAR']);
  testingAndContactTracing.setFilterByOus(true);
  testingAndContactTracing.setFilterByPeriods(true);
  testingAndContactTracing.setType('textValues');

  const poes = new Visualization();
  poes.setData({ rows: [] });
  poes.setD2(store.d2);
  poes.setDx([
    { dx: 'eYpIcHdIk5J', label: 'POEs Available' },
    { dx: 'mHl9HLVJ9X0', label: 'POEs Activated' },
    { dx: 'uKHils0UxEe', label: 'POEs Testing' },
  ]);
  poes.setPeriods(['THIS_YEAR']);
  poes.setFilterByOus(true);
  poes.setFilterByPeriods(true);
  poes.setType('textValues');

  const incidence = new Visualization();
  incidence.setD2(store.d2);
  incidence.setDx([
    { dx: 'wAOwXzZwZhs', label: 'POEs Available' },
  ]);
  incidence.setPeriods(['LAST_14_DAYS']);
  incidence.setFilterByOus(true);
  incidence.setFilterByPeriods(false);
  incidence.setType('chart');
  incidence.setChartType('line');
  incidence.setDimension(d1.width - 120, d1.height - 50);

  const dailyInfection = new Visualization();
  dailyInfection.setD2(store.d2);
  dailyInfection.setDx([
    { dx: 'Etwx5Yv3jBp', label: 'POEs Available' },
  ]);
  dailyInfection.setPeriods(['LAST_14_DAYS']);
  dailyInfection.setFilterByOus(true);
  dailyInfection.setFilterByPeriods(false);
  dailyInfection.setType('chart');
  dailyInfection.setChartType('column');
  dailyInfection.setDimension(d2.width - 200, d2.height - 50)

  const deaths = new Visualization();
  deaths.setD2(store.d2);
  deaths.setData({ rows: [] });

  deaths.setDx([
    { dx: 'C3a2t1kIppc', label: 'Total Deaths' },
  ]);
  deaths.setPeriods(['THIS_YEAR']);
  deaths.setFilterByOus(true);
  deaths.setFilterByPeriods(true);
  deaths.setType('textValues');

  const heathWorkers = new Visualization();
  heathWorkers.setD2(store.d2);
  heathWorkers.setData({ rows: [] });

  heathWorkers.setDx([
    { dx: 'pSaKi4mRE9N', label: 'Total Health Workers' },
    {
      dx: 'Ajm4ssIgZq4', label: 'Health Workers Testers', child: {
        dx: 'kLUxutfrUjZ',
        chart: 'line'
      }
    },
    {
      dx: 'Etwx5Yv3jBp', className: 'red', label: 'Positive Health Workers', child: {
        dx: 'kLUxutfrUjZ',
        chart: 'line'
      }
    },
  ]);
  heathWorkers.setPeriods(['THIS_YEAR']);
  heathWorkers.setFilterByOus(true);
  heathWorkers.setFilterByPeriods(true);
  heathWorkers.setType('textValues');

  const travellers = new Visualization();
  travellers.setData({ rows: [] });
  travellers.setD2(store.d2);
  travellers.setDx([
    { dx: 'Wt8gxkBiJZ8', label: 'Travellers Registered at POEs' },
    { dx: 'BMi59SCKIFi', label: 'Travellers Tested at POEs' },
    { dx: 'GGoxErWQ12J', label: 'Travellers Tested Positive' },
    { dx: 'vpDs2i5Fc4r', label: 'Contacts of Travellers Tested at POEs' },
    { dx: 'z1cgvbudBq6', label: 'Contacts of Travellers Tested Positive' },
  ]);
  travellers.setPeriods(['THIS_YEAR']);
  travellers.setFilterByOus(true);
  travellers.setFilterByPeriods(true);
  travellers.setType('textValues');


  const positiveAtPOE = new Visualization();
  positiveAtPOE.setD2(store.d2);
  positiveAtPOE.setDx([
    { dx: 'upO9ps9ItXy', label: 'POEs Available' },
  ]);
  positiveAtPOE.setPeriods(['LAST_14_DAYS']);
  positiveAtPOE.setFilterByOus(true);
  positiveAtPOE.setFilterByPeriods(false);
  positiveAtPOE.setType('chart');
  positiveAtPOE.setChartType('column');
  // positiveAtPOE.setOrgUnitGroups(['aobWYizg7hR'])
  positiveAtPOE.setDimension(d3.width - 10, d3.height - 500);

  const testingCapacity = new Visualization();
  testingCapacity.setD2(store.d2);
  testingCapacity.setDx([
    { dx: 'qdnLQfWOYzC', label: 'POEs Available' },
  ]);
  testingCapacity.setPeriods(['THIS_YEAR']);
  testingCapacity.setOrgUnitGroups(['Ej1BuUrJ9Rm']);
  testingCapacity.setFilterByOus(false);
  testingCapacity.setFilterByPeriods(true);
  testingCapacity.setType('chart');
  testingCapacity.setChartType('column');
  testingCapacity.setDimension(d4.width - 190, d4.height - 50)

  const testingSites = new Visualization();
  testingSites.setD2(store.d2);
  testingSites.setData({ rows: [] });

  testingSites.setDx([
    { dx: 'pSaKi4mRE9N', label: 'Total Sites Established' },
    {
      dx: 'Ajm4ssIgZq4', label: 'Total Testing Capacity',
    },
    {
      dx: 'Etwx5Yv3jBp', className: 'red', label: 'Total Tests Today', child: {
        dx: 'kLUxutfrUjZ',
        chart: 'line'
      }
    },
  ]);
  testingSites.setPeriods(['THIS_YEAR']);
  testingSites.setFilterByOus(true);
  testingSites.setFilterByPeriods(true);
  testingSites.setType('textValues');

  return (
    <div>
      <ResponsiveGridLayout
        className="layout"
        containerPadding={[5, 5]}
        margin={[5, 5]}
        breakpoints={{
          xxl: 3400,
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0,
        }}
        cols={{ xxl: 12, lg: 12, md: 9, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={66}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', background: '#F4F4F4' }}
          key="1"
          ref={c11}
          data-grid={{
            w: 3,
            h: 2,
            x: 0,
            y: 0,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Admissions and Bed Occupancy</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: "center", height: d11.height ? d11.height - 38 : 30 }}>
            {display(beds)}
          </div>
        </div>
        <div
          style={{ background: '#F4F4F4', height: '100%' }}
          key="2"
          ref={c22}
          data-grid={{
            w: 6,
            h: 2,
            x: 3,
            y: 0,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Testing and Contact Tracing</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', height: d22.height ? d22.height - 38 : 30 }}>
            {display(testingAndContactTracing)}
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', background: '#F4F4F4' }}
          key="3"
          ref={c33}
          data-grid={{
            w: 3,
            h: 2,
            x: 9,
            y: 0,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Point of Entries(POEs)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: "center", height: d33.height ? d33.height - 38 : 30 }}>
            {display(poes)}
          </div>
        </div>

        <div
          key="4"
          ref={c1}
          style={{ display: 'flex', flexDirection: 'column', background: '#F4F4F4' }}
          data-grid={{
            w: 4,
            h: 5,
            x: 0,
            y: 2,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Case Incidence</span>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ margin: 5 }}>
              {display(incidence)}
            </div>
            <div style={{ padding: 5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}> {display(deaths)}</div>
          </div>
        </div>
        <div
          style={{ background: '#F4F4F4' }}
          key="5"
          ref={c2}
          data-grid={{
            w: 5,
            h: 5,
            x: 4,
            y: 2,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Health Worker Infections</span>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ margin: 5 }}>
              {display(dailyInfection)}
            </div>
            <div style={{ padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>{display(heathWorkers)}</div>
          </div>
        </div>
        <div
          style={{ background: '#F4F4F4' }}
          key="6"
          ref={c3}
          data-grid={{
            w: 3,
            h: 11,
            x: 9,
            y: 2,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Travels and Testing</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: d3.height ? d3.height - 38 : '' }}>
            <div style={{ margin: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {display(travellers)}
            </div>
            <div style={{ padding: 5 }}>{display(positiveAtPOE)}</div>
          </div>
        </div>
        <div
          style={{ background: '#F4F4F4', height: '100%' }}
          key="7"
          ref={c4}
          data-grid={{
            w: 9,
            h: 6,
            x: 0,
            y: 7,
            static: process.env.NODE_ENV === "production",
          }}
        >
          <div style={{ background: '#d8d8d8', minHeight: 38, maxHeight: 38, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 10 }}>Testing Sites and Capacity</span>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ margin: 5, height: d4.height - 50, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {display(testingSites)}
            </div>
            <div style={{ padding: 5 }}>{display(testingCapacity)}</div>
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
});

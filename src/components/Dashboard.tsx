import { Card } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useStore } from "../Context";
import { Visualization, TItem } from "../models/Visualization";
import { Chart } from "./visualizations/Chart";
import { Map } from "./visualizations/Map";
import { SingleValues } from "./visualizations/SingleValues";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Dashboard = observer(() => {
  const store = useStore();

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
    { dx: 'C3a2t1kIppc', label: 'Bed Capacity' },
    { dx: 'rw0BHHe8S29', label: 'Beds Available' },
    { dx: 'oK76O9uCtEe', label: 'Admissions' },
    { dx: 'v9r6qu7MAvk', chart: 'circle' }
  ]);
  beds.setPeriods(['THIS_YEAR']);
  beds.setFilterByOus(true);
  beds.setFilterByPeriods(true);
  beds.setType('textValues');

  const testingAndContactTracing = new Visualization();
  testingAndContactTracing.setData({ rows: [] });
  testingAndContactTracing.setD2(store.d2);
  testingAndContactTracing.setDx([
    { dx: 'BM25rsG76xg', label: 'Total Tests Done' },
    {
      dx: 'wAOwXzZwZhs', label: 'Tested Positive', child: {
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
      dx: 'z1cgvbudBq6', label: 'Positive Contacts', child: {
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
      dx: 'Etwx5Yv3jBp', label: 'Positive Health Workers', child: {
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
    { dx: 'pWFRpK6LDuG', label: 'Travellers Registered at POEs' },
  ]);
  travellers.setPeriods(['THIS_YEAR']);
  travellers.setFilterByOus(true);
  travellers.setFilterByPeriods(true);
  travellers.setType('textValues');


  const positiveAtPOE = new Visualization();
  positiveAtPOE.setD2(store.d2);
  positiveAtPOE.setDx([
    { dx: 'Etwx5Yv3jBp', label: 'POEs Available' },
  ]);
  positiveAtPOE.setPeriods(['LAST_14_DAYS']);
  positiveAtPOE.setFilterByOus(true);
  positiveAtPOE.setFilterByPeriods(false);
  positiveAtPOE.setType('chart');
  positiveAtPOE.setChartType('column');


  return (
    <div>
      <ResponsiveGridLayout
        className="layout"
        containerPadding={[5, 0]}
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
        <Card
          size="small"
          style={{ background: '#F4F4F4', height: '100%' }}
          bordered={false}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'space-around' }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="1"
          data-grid={{
            w: 3,
            h: 2,
            x: 0,
            y: 0,
            static: false,
          }}
        >
          {display(beds)}
        </Card>
        <Card
          size="small"
          bordered={false}
          style={{ background: '#F4F4F4', height: '100%' }}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'space-around' }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="2"
          data-grid={{
            w: 6,
            h: 2,
            x: 3,
            y: 0,
            static: false,
          }}
        >
          {display(testingAndContactTracing)}
        </Card>
        <Card
          size="small"
          style={{ background: '#F4F4F4', height: '100%' }}
          bordered={false}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'space-around' }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="3"
          data-grid={{
            w: 3,
            h: 2,
            x: 9,
            y: 0,
            static: false,
          }}
        >
          {display(poes)}
        </Card>

        <Card
          size="small"
          style={{ background: '#F4F4F4', height: '100%' }}
          bordered={false}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex' }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="4"
          data-grid={{
            w: 4,
            h: 5,
            x: 0,
            y: 2,
            static: false,
          }}
        >
          <div style={{ width: '80%' }}>
            {display(incidence)}
          </div>
          <div style={{ padding: 10 }}> {display(deaths)}</div>
        </Card>
        <Card
          size="small"
          style={{ background: '#F4F4F4', height: '100%' }}
          bordered={false}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex' }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="5"
          data-grid={{
            w: 5,
            h: 5,
            x: 4,
            y: 3,
            static: false,
          }}
        >
          <div style={{ width: '70%' }}>
            {display(dailyInfection)}
          </div>
          <div style={{ padding: 10 }}> {display(heathWorkers)}</div>
        </Card>
        <Card
          size="small"
          style={{ background: '#F4F4F4', height: '100%' }}
          bordered={false}
          bodyStyle={{
            background: '#F4F4F4', display: 'flex', flexDirection: 'column'
          }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="6"
          data-grid={{
            w: 3,
            h: 11,
            x: 9,
            y: 2,
            static: false,
          }}
        >
          <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>{display(travellers)}</div>
          <div style={{}}>{display(positiveAtPOE)}</div>
        </Card>
        <Card
          size="small"
          bordered={false}
          style={{ background: '#F4F4F4', height: '100%' }}
          bodyStyle={{
            background: '#F4F4F4', padding: 0, margin: 0, display: 'flex'
          }}
          headStyle={{ background: '#D8D8D8' }}
          title="Card title"
          key="7"
          data-grid={{
            w: 9,
            h: 6,
            x: 0,
            y: 6,
            static: false,
          }}
        >
          <div style={{ width: '30%' }}> {display(heathWorkers)}</div>
          <div style={{ width: '70%' }}>
            {display(dailyInfection)}
          </div>
        </Card>
      </ResponsiveGridLayout>
    </div>
  );
});

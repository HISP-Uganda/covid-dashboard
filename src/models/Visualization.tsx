import { observable, action, computed } from "mobx";
import { generateUid } from "../utils/uid";
import { fromPairs, flatten } from 'lodash'

export class Visualization {
  @observable height: number = 0;
  @observable width: number = 0;
  @observable x: number = 0;
  @observable y: number = 0;
  @observable w: number = 1;
  @observable h: number = 1;
  @observable i: string = generateUid();
  @observable d2: any;
  @observable type: string = "chart";
  @observable chartType: string = "column";
  @observable data: any;
  @observable title: string = "";
  @observable subtitle: string = "";
  @observable xAxis: string = "";
  @observable yAxis: string = "";
  @observable loading: boolean = false;
  @observable cssClass = "";
  @observable editable: boolean = process.env.NODE_ENV === "production";

  @observable dx: any = [];
  @observable periods: string[] = [];
  @observable ou: string[] = [];
  @observable filterByOus: boolean = true;
  @observable filterByPeriods: boolean = true;
  @observable geoJson: any;
  @observable metadata: any = {}

  @action setLoading = (val: boolean) => (this.loading = val);
  @action setDx = (dx: any[]) => (this.dx = dx);
  @action setOu = (ou: string[]) => (this.ou = ou);
  @action setPeriods = (periods: string[]) => (this.periods = periods);
  @action setFilterByOus = (val: boolean) => (this.filterByOus = val);
  @action setFilterByPeriods = (val: boolean) => (this.filterByPeriods = val);
  @action setChartType = (val: string) => (this.chartType = val);
  @action setType = (val: string) => (this.type = val);
  @action setData = (val: any) => (this.data = val);
  @action setTitle = (val: string) => (this.title = val);
  @action setSubtitle = (val: string) => (this.subtitle = val);
  @action setXAxis = (val: string) => (this.xAxis = val);
  @action setD2 = (val: any) => (this.d2 = val);
  @action setCssClass = (val: any) => (this.cssClass = val);
  @action setMetadata = (val: any) => (this.metadata = val);
  @action setDimension = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  };
  @action setCoordinates = (x: number, y: number, w: number, h: number) => {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  };
  @action fetchFromAnalytics = async () => {
    if (this.chartType !== "map") {
      this.setLoading(true);
    }
    if (this.dx.length > 0 && this.periods.length > 0 && this.ou.length > 0) {
      const realDimensions = this.dx.map((d: any) => {
        const child = d.child ? [d.child.dx] : [];
        return [d.dx, ...child]
      })
      let req = new this.d2.analytics.request()
        .addDataDimension(flatten(realDimensions))
        .withAggregationType("SUM")
        .withSkipRounding(true);

      if (this.filterByOus) {
        req = req.addOrgUnitFilter(this.ou);
      } else {
        req = req.addOrgUnitDimension(this.ou);
      }
      if (this.filterByPeriods) {
        req = req.addPeriodFilter(this.periods);
      } else {
        req = req.addPeriodDimension(this.periods);
      }
      const data = await this.d2.analytics.aggregate.get(req);
      this.setData(data);
    }
    if (this.chartType !== "map") {
      this.setLoading(false);
    }
  };

  @action fetchGeoJson = async (unit: string) => {
    if (unit) {
      const api = this.d2.Api.getApi();
      const { children } = await api.get(`organisationUnits/${unit}`, {
        fields: "children[id,name,geometry]",
      });

      const features = children
        .map((child: any) => {
          if (!child.geometry || child.geometry.type === "Point") {
            return null;
          }
          return {
            properties: {
              id: child.id,
              name: child.name,
            },
            type: "Feature",
            geometry: child.geometry,
          };
        })
        .filter((x: any) => {
          return !!x;
        });

      this.geoJson = {
        type: "FeatureCollection",
        features,
      };
      this.setOu(children.map((c: any) => c.id));
    }
  };

  @action fetchUnitsAndData = async (unit: string) => {
    this.setLoading(true);
    await this.fetchGeoJson(unit);
    await this.fetchFromAnalytics();
    this.setLoading(false);
  };

  @computed
  get chart() {
    if (this.type === "chart") {
      let xAxis = {};
      let series: any[] = [];

      let fullChart: any = {
        credits: { enabled: false },
        title: {
          text: `<span style="font-size: 20px;font-weight:bolder">${this.title}</span>`,
        },
        subtitle: {
          text: `<span>${this.subtitle}</span>`,
        },
      };


      let colorAxis = {};
      let chart: any = {
        height: this.height,
        width: this.width,
      };
      let plotOptions = {};
      let tooltip: any = {};

      if (this.chartType === "column" && this.data) {
        chart = { ...chart, type: this.chartType };
        let categories: any[] = [];
        if (!this.filterByPeriods) {
          categories = this.data.metaData.dimensions.pe.map((p: string) => {
            return this.data.metaData.items[p].name;
          });

          series = this.dx.map((d: any) => {
            const data = this.data.metaData.dimensions.pe.map((p: string) => {
              const dy = this.data.rows.find((r: any[]) => {
                return d.dx === r[0] && p === r[1];
              });
              if (dy) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
            return { name: this.data.metaData.items[d.dx].name, data };
          });
        }

        xAxis = {
          categories,
          crosshair: true,
        };
        fullChart = {
          ...fullChart,
          chart,
          plotOptions,
          tooltip,
          xAxis,
          series,
        };
      } else if (this.chartType === "pie" && this.data) {
        chart = {
          ...chart,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: this.chartType,
        };
        tooltip = {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        };
        plotOptions = {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            },
          },
        };

        series = [
          {
            name: "Cases by Country",
            colorByPoint: true,
            data: this.data.rows.map((r: any[]) => {
              return {
                name: String(this.data.metaData.items[r[0]].name)
                  .replace("CC. ", "")
                  .replace(" Cases", ""),
                y: Number(r[1]),
              };
            }),
          },
        ];

        fullChart = {
          ...fullChart,
          chart,
          plotOptions,
          tooltip,
          xAxis,
          series,
        };
      } else if (this.chartType === "line" && this.data) {
        let categories: any[] = [];
        chart = { ...chart, type: this.chartType };
        if (!this.filterByPeriods) {
          categories = this.data.metaData.dimensions.pe.map((p: string) => {
            return this.data.metaData.items[p].name;
          });

          series = this.dx.map((d: any) => {
            const data = this.data.metaData.dimensions.pe.map((p: string) => {
              const dy = this.data.rows.find((r: any[]) => {
                return d.dx === r[0] && p === r[1];
              });
              if (dy) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
            return { name: this.data.metaData.items[d.dx].name, data };
          });
        }

        xAxis = {
          categories,
          crosshair: true,
        };

        fullChart = {
          ...fullChart,

          chart,

          plotOptions,
          tooltip,
          xAxis,
          series,
        };
      } else if (this.chartType === "map" && this.data) {
        chart = {
          ...chart,
          map: this.geoJson,
        };

        colorAxis = {
          tickPixelInterval: 100,
        };

        const realData = this.data.rows.map((r: any) => {
          return [r[1], Number(r[2])];
        });

        series = [
          {
            data: realData,
            keys: ["id", "value"],
            joinBy: "id",
            name: this.title,
            states: {
              hover: {
                color: "#a4edba",
              },
            },
            dataLabels: {
              enabled: true,
              format: "{point.properties.name}",
            },
          },
        ];

        fullChart = {
          ...fullChart,
          chart,
          series,
          colorAxis,
        };
      }
      return fullChart;
    } else if (this.type === "textValues") {
      if (this.data && this.dx.length > 0) {
        const dxes = this.dx.map((d: any, i: number) => {
          const searchedNum = this.data.rows.find((row: any) => {
            return row[0] === d.dx;
          });

          let child: any = null;

          if (d.child) {
            const childValue = this.data.rows.find((row: any) => {
              return row[0] === d.child.dx;
            });

            child = {
              label: d.child.label,
              value: childValue ? childValue[1] : '0',
              chart: d.child.chart
            }
          }

          return [d.dx, {
            label: d.label,
            dx: d.dx,
            value: searchedNum ? Number(searchedNum[1]).toLocaleString() : '0',
            chart: d.chart,
            child
          }]
        });
        return fromPairs(dxes);
      }
    }
    return this.data;
  }
}

export const Item = new Visualization();
export type TItem = typeof Item;
